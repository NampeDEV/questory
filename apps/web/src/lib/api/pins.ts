import { mockUserPins, mockPinClaims, badges as mockBadges, pins as mockPins } from '@/data/pins';
import type { PinWithStatus } from '@/data/pins';
import type { Badge, Pin, PinClaim, PinStatus } from '@/types/pin';

// Data-access facade for pins (RULE-005, S-010d)
// When NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
// queries Supabase; falls back to mock data otherwise.

function mapUserPinStatus(dbStatus: unknown): PinStatus {
  if (dbStatus === 'unlocked') return 'unlocked';
  if (dbStatus === 'claimed') return 'claimed';
  if (dbStatus === 'delivered') return 'delivered';
  return 'locked';
}

function mapClaimStatus(dbStatus: unknown): PinStatus {
  if (dbStatus === 'shipped') return 'shipped';
  if (dbStatus === 'delivered') return 'delivered';
  return 'claimed';
}

async function querySupabaseUserPins(userId: string): Promise<PinWithStatus[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('user_pins')
    .select('*, pins(id, badge_id, name, image_url)')
    .eq('user_id', userId);

  if (error || !data) return null;

  return (data as Record<string, unknown>[]).map((row) => {
    const pin = row['pins'] as Record<string, unknown> | null;
    return {
      id: String(pin?.['id'] ?? row['pin_id']),
      badgeId: String(pin?.['badge_id'] ?? ''),
      name: String(pin?.['name'] ?? ''),
      imageUrl: String(pin?.['image_url'] ?? ''),
      type: 'mission' as Pin['type'],
      rarity: 'common' as Badge['rarity'],
      status: mapUserPinStatus(row['status']),
    } satisfies PinWithStatus;
  });
}

async function querySupabasePinClaims(userId: string): Promise<PinClaim[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('pin_claims')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return null;

  return (data as Record<string, unknown>[]).map((row) => {
    const addr = (row['address_json'] as Record<string, unknown> | null) ?? {};
    return {
      id: String(row['id']),
      userId: String(row['user_id']),
      pinId: String(row['pin_id']),
      userBadgeId: '',
      status: mapClaimStatus(row['status']),
      shippingName: String(addr['name'] ?? ''),
      shippingAddress: String(addr['address'] ?? ''),
      trackingNumber: row['tracking_number'] != null ? String(row['tracking_number']) : null,
      claimedAt: String(row['created_at'] ?? new Date().toISOString()),
      shippedAt: null,
      deliveredAt: null,
    } satisfies PinClaim;
  });
}

export async function getUserPins(userId?: string): Promise<PinWithStatus[]> {
  if (userId) {
    const live = await querySupabaseUserPins(userId);
    if (live) return live;
  }
  return mockUserPins;
}

export async function getPinClaims(userId?: string): Promise<PinClaim[]> {
  if (userId) {
    const live = await querySupabasePinClaims(userId);
    if (live) return live;
  }
  return mockPinClaims;
}

export async function getBadges(): Promise<Badge[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('badges').select('*');
    if (!error && data) {
      return (data as Record<string, unknown>[]).map((row) => ({
        id: String(row['id']),
        name: String(row['name'] ?? ''),
        description: String(row['description'] ?? ''),
        imageUrl: String(row['image_url'] ?? ''),
        rarity: 'common' as Badge['rarity'],
        missionId: row['mission_id'] != null ? String(row['mission_id']) : null,
        boardTemplateId: null,
      }));
    }
  }
  return mockBadges;
}

export async function getPins(): Promise<Pin[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('pins').select('*');
    if (!error && data) {
      return (data as Record<string, unknown>[]).map((row) => ({
        id: String(row['id']),
        badgeId: String(row['badge_id'] ?? ''),
        name: String(row['name'] ?? ''),
        imageUrl: String(row['image_url'] ?? ''),
        type: 'mission' as Pin['type'],
      }));
    }
  }
  return mockPins;
}

