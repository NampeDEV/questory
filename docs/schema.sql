-- =============================================================================
-- Questory — Supabase Schema
-- Source of truth: SPEC-06 Data Model v2.0.0
-- Updated: 2026-05-30
-- Run order: this file is idempotent (CREATE TABLE IF NOT EXISTS)
-- =============================================================================

-- Enable UUID extension (already available in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM-like text domains (Postgres CHECK constraints keep Supabase compatible)
-- =============================================================================

-- =============================================================================
-- users
-- Mirrors auth.users; created via Supabase trigger on sign-up.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id           uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text        NOT NULL,
  email        text        UNIQUE NOT NULL,
  avatar_url   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: self read"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users: self update"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "users: admin full"
  ON public.users FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- board_templates
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.board_templates (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            text        UNIQUE NOT NULL,
  name            text        NOT NULL,
  description     text        NOT NULL,
  category        text        NOT NULL CHECK (category IN ('starter','regional','ultimate','custom')),
  quest_count     int         NOT NULL DEFAULT 0,
  cover_image_url text        NOT NULL,
  price_thb       int         NOT NULL CHECK (price_thb >= 0),
  status          text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.board_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "board_templates: public read active"
  ON public.board_templates FOR SELECT
  USING (status = 'active');

CREATE POLICY "board_templates: admin write"
  ON public.board_templates FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- activation_codes
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.activation_codes (
  id                  uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                text        UNIQUE NOT NULL,
  board_template_id   uuid        NOT NULL REFERENCES public.board_templates(id),
  redeemed_by         uuid        REFERENCES public.users(id),
  redeemed_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;

-- Only admin may insert/list; user can check their own redemption
CREATE POLICY "activation_codes: admin full"
  ON public.activation_codes FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- user_boards
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_boards (
  id                  uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  board_template_id   uuid        NOT NULL REFERENCES public.board_templates(id),
  activation_code     text        NOT NULL,
  activated_at        timestamptz NOT NULL DEFAULT now(),
  progress_completed  int         NOT NULL DEFAULT 0,
  progress_total      int         NOT NULL DEFAULT 0,
  status              text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','archived')),
  UNIQUE (user_id, board_template_id)
);

CREATE INDEX IF NOT EXISTS user_boards_user_id_status_idx ON public.user_boards (user_id, status);

ALTER TABLE public.user_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_boards: self read/update"
  ON public.user_boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_boards: self insert"
  ON public.user_boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_boards: admin full"
  ON public.user_boards FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- badges
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text        NOT NULL,
  description text        NOT NULL,
  image_url   text        NOT NULL,
  rarity      text        NOT NULL CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  category    text        NOT NULL CHECK (category IN ('mountain','waterfall','marine','forest','completion','region'))
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges: public read"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "badges: admin write"
  ON public.badges FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- missions
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.missions (
  id                  uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_template_id   uuid        NOT NULL REFERENCES public.board_templates(id),
  name                text        NOT NULL,
  description         text        NOT NULL,
  park_name           text        NOT NULL,
  park_code           text        NOT NULL,
  region              text        NOT NULL CHECK (region IN ('north','central','northeast','east','south')),
  category            text        NOT NULL CHECK (category IN ('mountain','waterfall','marine','forest')),
  difficulty          text        NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  latitude            numeric     NOT NULL,
  longitude           numeric     NOT NULL,
  cover_image_url     text        NOT NULL,
  reward_badge_id     uuid        REFERENCES public.badges(id),
  sort_order          int         NOT NULL DEFAULT 0,
  status              text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived'))
);

CREATE INDEX IF NOT EXISTS missions_board_template_sort_idx ON public.missions (board_template_id, sort_order);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "missions: public read active"
  ON public.missions FOR SELECT
  USING (status = 'active');

CREATE POLICY "missions: admin write"
  ON public.missions FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- mission_submissions
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mission_submissions (
  id                  uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_board_id       uuid        NOT NULL REFERENCES public.user_boards(id),
  mission_id          uuid        NOT NULL REFERENCES public.missions(id),
  photo_url           text        NOT NULL,
  latitude            numeric,
  longitude           numeric,
  travel_date         date        NOT NULL,
  memory_note         text,
  share_permission    boolean     NOT NULL DEFAULT false,
  safety_acknowledged boolean     NOT NULL DEFAULT false,
  status              text        NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending','approved','need_more_info','rejected')),
  reviewer_note       text,
  reviewed_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  -- prevent duplicate submission for same mission on the same board
  UNIQUE (user_board_id, mission_id)
);

CREATE INDEX IF NOT EXISTS submissions_user_status_created_idx
  ON public.mission_submissions (user_id, status, created_at DESC);

ALTER TABLE public.mission_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "submissions: self insert/read"
  ON public.mission_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "submissions: self insert"
  ON public.mission_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "submissions: admin full"
  ON public.mission_submissions FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- user_badges
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id                      uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id                uuid        NOT NULL REFERENCES public.badges(id),
  mission_submission_id   uuid        REFERENCES public.mission_submissions(id),
  unlocked_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_badges: self read"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_badges: admin full"
  ON public.user_badges FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- pins
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.pins (
  id              uuid  PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_id        uuid  UNIQUE NOT NULL REFERENCES public.badges(id),
  name            text  NOT NULL,
  sku             text  UNIQUE NOT NULL,
  image_url       text  NOT NULL,
  rarity          text  NOT NULL CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  inventory_count int   NOT NULL DEFAULT 0 CHECK (inventory_count >= 0)
);

ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pins: public read"
  ON public.pins FOR SELECT
  USING (true);

CREATE POLICY "pins: admin write"
  ON public.pins FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- pin_claims
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.pin_claims (
  id                      uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pin_id                  uuid        NOT NULL REFERENCES public.pins(id),
  mission_submission_id   uuid        NOT NULL REFERENCES public.mission_submissions(id),
  shipping_name           text        NOT NULL,
  shipping_phone          text        NOT NULL,
  shipping_address        text        NOT NULL,
  shipping_fee_thb        int         NOT NULL DEFAULT 0,
  status                  text        NOT NULL DEFAULT 'claimed'
                                      CHECK (status IN ('claimed','processing','shipped','delivered')),
  tracking_number         text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, pin_id)
);

CREATE INDEX IF NOT EXISTS pin_claims_user_status_idx ON public.pin_claims (user_id, status);

ALTER TABLE public.pin_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pin_claims: self insert/read"
  ON public.pin_claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "pin_claims: self insert"
  ON public.pin_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pin_claims: admin full"
  ON public.pin_claims FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- memories
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.memories (
  id                      uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mission_submission_id   uuid        NOT NULL REFERENCES public.mission_submissions(id),
  title                   text        NOT NULL,
  note                    text,
  photo_urls              jsonb       NOT NULL DEFAULT '[]',
  location_name           text,
  travel_date             date,
  visibility              text        NOT NULL DEFAULT 'private'
                                      CHECK (visibility IN ('public','private','unlisted')),
  created_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "memories: self all"
  ON public.memories FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "memories: public read"
  ON public.memories FOR SELECT
  USING (visibility = 'public');

-- =============================================================================
-- plans
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plans (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            text        UNIQUE NOT NULL,
  title           text        NOT NULL,
  description     text        NOT NULL,
  cover_image_url text        NOT NULL,
  duration_days   int         NOT NULL CHECK (duration_days >= 1),
  budget_min_thb  int         NOT NULL DEFAULT 0,
  budget_max_thb  int         NOT NULL DEFAULT 0,
  difficulty      text        NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  region          text        NOT NULL,
  creator_id      uuid        REFERENCES public.users(id),
  copy_count      int         NOT NULL DEFAULT 0,
  status          text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS plans_status_copy_count_idx ON public.plans (status, copy_count DESC);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans: public read active"
  ON public.plans FOR SELECT
  USING (status = 'active');

CREATE POLICY "plans: admin write"
  ON public.plans FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- plan_items
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plan_items (
  id                  uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id             uuid    NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  day_number          int     NOT NULL CHECK (day_number >= 1),
  title               text    NOT NULL,
  description         text,
  location_name       text,
  latitude            numeric,
  longitude           numeric,
  estimated_cost_thb  int     NOT NULL DEFAULT 0,
  sort_order          int     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS plan_items_plan_day_sort_idx ON public.plan_items (plan_id, day_number, sort_order);

ALTER TABLE public.plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_items: public read (via plan)"
  ON public.plan_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.plans p
      WHERE p.id = plan_id AND p.status = 'active'
    )
  );

CREATE POLICY "plan_items: admin write"
  ON public.plan_items FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- products
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            text        UNIQUE NOT NULL,
  name            text        NOT NULL,
  description     text        NOT NULL,
  type            text        NOT NULL CHECK (type IN ('board','pin_set','gift_box','sticker','passport')),
  price_thb       int         NOT NULL CHECK (price_thb >= 0),
  image_urls      jsonb       NOT NULL DEFAULT '[]',
  stock_count     int         NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
  status          text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold_out','archived'))
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products: public read active"
  ON public.products FOR SELECT
  USING (status IN ('active','sold_out'));

CREATE POLICY "products: admin write"
  ON public.products FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- orders
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id               uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_thb        int         NOT NULL CHECK (total_thb >= 0),
  status           text        NOT NULL DEFAULT 'draft'
                               CHECK (status IN ('draft','paid','processing','shipped','delivered','cancelled')),
  shipping_address text        NOT NULL,
  tracking_number  text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders: self read"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders: admin full"
  ON public.orders FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- order_items
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id          uuid  PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    uuid  NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  uuid  NOT NULL REFERENCES public.products(id),
  quantity    int   NOT NULL CHECK (quantity >= 1),
  price_thb   int   NOT NULL CHECK (price_thb >= 0)
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items: self read (via order)"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items: admin full"
  ON public.order_items FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- ai_cache
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.ai_cache (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key       text        UNIQUE NOT NULL,
  model           text        NOT NULL,
  prompt_hash     text        NOT NULL,
  response_json   jsonb       NOT NULL,
  tokens_used     int         NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz
);

CREATE INDEX IF NOT EXISTS ai_cache_key_idx ON public.ai_cache (cache_key);
CREATE INDEX IF NOT EXISTS ai_cache_expires_idx ON public.ai_cache (expires_at)
  WHERE expires_at IS NOT NULL;

-- No RLS — server-side only via service role key

-- =============================================================================
-- ai_plugin_usage
-- Tracks monthly free-tier credit usage per user per AI plugin (S-023, SPEC-09).
-- Written server-side via service role; users may read their own rows.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.ai_plugin_usage (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plugin      text        NOT NULL CHECK (plugin IN ('trip-planner','memory-writer','caption','checklist','recommend')),
  month       text        NOT NULL,  -- 'YYYY-MM'
  count       int         NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, plugin, month)
);

CREATE INDEX IF NOT EXISTS ai_plugin_usage_user_month_idx
  ON public.ai_plugin_usage (user_id, month);

ALTER TABLE public.ai_plugin_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_plugin_usage: self read"
  ON public.ai_plugin_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Writes are service-role only (bypasses RLS automatically)

-- Atomic upsert-and-increment — avoids race conditions on concurrent AI calls.
CREATE OR REPLACE FUNCTION public.increment_ai_plugin_usage(
  p_user_id uuid,
  p_plugin  text,
  p_month   text
) RETURNS void AS $$
BEGIN
  INSERT INTO public.ai_plugin_usage (user_id, plugin, month, count)
  VALUES (p_user_id, p_plugin, p_month, 1)
  ON CONFLICT (user_id, plugin, month)
  DO UPDATE SET
    count      = ai_plugin_usage.count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- RLS: allow public read of approved shared submissions (for OG image endpoint)
-- =============================================================================
CREATE POLICY "submissions: public read approved shared"
  ON public.mission_submissions FOR SELECT
  USING (status = 'approved' AND share_permission = true);

-- =============================================================================
-- Trigger: auto-create public.users row on Supabase Auth sign-up
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, display_name, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- Seed: activation code for AC-APP-002 (BEGINNER10-DEMO → Starter board)
-- Requires board_templates to be seeded first.
-- =============================================================================
-- INSERT INTO public.activation_codes (code, board_template_id)
-- SELECT 'BEGINNER10-DEMO', id FROM public.board_templates WHERE slug = 'starter-10-parks'
-- ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- NATIONAL PARK EXTENSION — ThaiPark DB Design v1.0
-- Aligned with: ThaiPark_Database_Design.md
-- =============================================================================

-- =============================================================================
-- regions
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.regions (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_th    text        NOT NULL,
  name_en    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "regions: public read"
  ON public.regions FOR SELECT USING (true);

CREATE POLICY "regions: admin write"
  ON public.regions FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- provinces
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.provinces (
  id                 uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id          uuid    NOT NULL REFERENCES public.regions(id),
  province_name_th   text    NOT NULL,
  province_name_en   text    NOT NULL,
  latitude           numeric NOT NULL,
  longitude          numeric NOT NULL
);

ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "provinces: public read"
  ON public.provinces FOR SELECT USING (true);

CREATE POLICY "provinces: admin write"
  ON public.provinces FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- national_parks
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.national_parks (
  id             uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  park_code      varchar(10) UNIQUE NOT NULL,
  name_th        text        NOT NULL,
  name_en        text        NOT NULL,
  description    text        NOT NULL DEFAULT '',
  province_id    uuid        NOT NULL REFERENCES public.provinces(id),
  region_id      uuid        NOT NULL REFERENCES public.regions(id),
  cover_image    text,
  latitude       numeric     NOT NULL,
  longitude      numeric     NOT NULL,
  map_url        text,
  status         text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  total_reviews  int         NOT NULL DEFAULT 0,
  avg_rating     numeric(3,2) NOT NULL DEFAULT 0.00,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS national_parks_region_status_idx ON public.national_parks (region_id, status);
CREATE INDEX IF NOT EXISTS national_parks_province_idx       ON public.national_parks (province_id);

ALTER TABLE public.national_parks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "national_parks: public read active"
  ON public.national_parks FOR SELECT
  USING (status = 'active');

CREATE POLICY "national_parks: admin full"
  ON public.national_parks FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- park_images
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.park_images (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  park_id    uuid NOT NULL REFERENCES public.national_parks(id) ON DELETE CASCADE,
  image_url  text NOT NULL,
  image_type text NOT NULL CHECK (image_type IN ('cover','gallery')),
  sort_order int  NOT NULL DEFAULT 0
);

ALTER TABLE public.park_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "park_images: public read"
  ON public.park_images FOR SELECT USING (true);

CREATE POLICY "park_images: admin write"
  ON public.park_images FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- park_places  (จุดท่องเที่ยวภายในอุทยาน)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.park_places (
  id           uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  park_id      uuid    NOT NULL REFERENCES public.national_parks(id) ON DELETE CASCADE,
  place_name   text    NOT NULL,
  description  text    NOT NULL DEFAULT '',
  category     text    NOT NULL CHECK (category IN ('camping','waterfall','cave','viewpoint','trail','forest','lake','other')),
  latitude     numeric NOT NULL,
  longitude    numeric NOT NULL,
  image_url    text,
  status       text    NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','seasonal'))
);

CREATE INDEX IF NOT EXISTS park_places_park_id_idx ON public.park_places (park_id);

ALTER TABLE public.park_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "park_places: public read"
  ON public.park_places FOR SELECT USING (true);

CREATE POLICY "park_places: admin write"
  ON public.park_places FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- park_place_seasons
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.park_place_seasons (
  id         uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id   uuid    NOT NULL REFERENCES public.park_places(id) ON DELETE CASCADE,
  open_date  date,
  close_date date,
  is_open    boolean NOT NULL DEFAULT true,
  note       text
);

ALTER TABLE public.park_place_seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "park_place_seasons: public read"
  ON public.park_place_seasons FOR SELECT USING (true);

CREATE POLICY "park_place_seasons: admin write"
  ON public.park_place_seasons FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- park_fees  (ค่าธรรมเนียมเข้าอุทยาน)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.park_fees (
  id               uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  park_id          uuid    NOT NULL REFERENCES public.national_parks(id) ON DELETE CASCADE,
  nationality_type text    NOT NULL CHECK (nationality_type IN ('thai','foreign')),
  age_group        text    NOT NULL CHECK (age_group IN ('adult','child')),
  price            numeric NOT NULL CHECK (price >= 0)
);

ALTER TABLE public.park_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "park_fees: public read"
  ON public.park_fees FOR SELECT USING (true);

CREATE POLICY "park_fees: admin write"
  ON public.park_fees FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- weather_cache  (เก็บข้อมูลสภาพอากาศจาก OpenWeather API)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.weather_cache (
  id                  uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  park_id             uuid        NOT NULL REFERENCES public.national_parks(id) ON DELETE CASCADE,
  temperature         numeric     NOT NULL,
  weather_main        text        NOT NULL,
  weather_description text        NOT NULL,
  icon                text        NOT NULL,
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (park_id)
);

-- No RLS — written by server-side cron via service role key

-- =============================================================================
-- air_quality  (เก็บค่า PM2.5 / AQI)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.air_quality (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  park_id     uuid        NOT NULL REFERENCES public.national_parks(id) ON DELETE CASCADE,
  pm25        numeric     NOT NULL,
  aqi_level   text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (park_id)
);

-- No RLS — written by server-side cron via service role key

-- =============================================================================
-- park_checkins  (เช็คอินอุทยาน)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.park_checkins (
  id                uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  park_id           uuid        NOT NULL REFERENCES public.national_parks(id),
  latitude          numeric,
  longitude         numeric,
  checkin_time      timestamptz NOT NULL DEFAULT now(),
  verification_type text        NOT NULL DEFAULT 'manual' CHECK (verification_type IN ('gps','qr','manual')),
  device_id         text
);

CREATE INDEX IF NOT EXISTS park_checkins_user_park_idx ON public.park_checkins (user_id, park_id);

ALTER TABLE public.park_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "park_checkins: self insert/read"
  ON public.park_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "park_checkins: self insert"
  ON public.park_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "park_checkins: admin full"
  ON public.park_checkins FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- park_reviews  (รีวิวอุทยาน)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.park_reviews (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  park_id     uuid        NOT NULL REFERENCES public.national_parks(id),
  rating      numeric(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text        NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, park_id)
);

CREATE INDEX IF NOT EXISTS park_reviews_park_id_idx ON public.park_reviews (park_id, created_at DESC);

ALTER TABLE public.park_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "park_reviews: public read"
  ON public.park_reviews FOR SELECT USING (true);

CREATE POLICY "park_reviews: self insert"
  ON public.park_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "park_reviews: admin full"
  ON public.park_reviews FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Trigger: keep national_parks.avg_rating and total_reviews up-to-date
CREATE OR REPLACE FUNCTION public.refresh_park_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE public.national_parks
  SET
    avg_rating    = (SELECT AVG(rating)   FROM public.park_reviews WHERE park_id = COALESCE(NEW.park_id, OLD.park_id)),
    total_reviews = (SELECT COUNT(*)      FROM public.park_reviews WHERE park_id = COALESCE(NEW.park_id, OLD.park_id))
  WHERE id = COALESCE(NEW.park_id, OLD.park_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_refresh_park_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.park_reviews
  FOR EACH ROW EXECUTE FUNCTION public.refresh_park_rating();

-- =============================================================================
-- user_favorites  (อุทยานที่ผู้ใช้บันทึกไว้)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  park_id    uuid        NOT NULL REFERENCES public.national_parks(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, park_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_favorites: self all"
  ON public.user_favorites FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "user_favorites: admin read"
  ON public.user_favorites FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- user_place_notifications  (แจ้งเตือนเมื่อสถานที่เปิดให้บริการ)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_place_notifications (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  place_id   uuid        NOT NULL REFERENCES public.park_places(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, place_id)
);

ALTER TABLE public.user_place_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_place_notifications: self all"
  ON public.user_place_notifications FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- Backfill: link missions to national_parks via park_code (nullable FK)
-- Run after both tables are populated.
-- =============================================================================
-- ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS national_park_id uuid REFERENCES public.national_parks(id);
-- UPDATE public.missions m SET national_park_id = np.id
--   FROM public.national_parks np WHERE np.park_code = m.park_code;

