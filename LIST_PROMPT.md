# LIST_PROMPT — AI Image Generation Prompts

> รายการ Prompt สำหรับสร้างรูปทั้งหมดในเว็บไซต์ Questory  
> คัดลอก prompt ใส่ ChatGPT (DALL·E 3) หรือ Midjourney ได้เลย  
> ไฟล์ปลายทางระบุไว้ที่ `→ save as` ในแต่ละรายการ

---

## BRAND STYLE GUIDE (ใส่ท้าย Prompt ทุกรูปที่ต้องการ consistency)

```
Style: premium adventure collector aesthetic, Thai national park passport feel, 
warm parchment and deep forest tones, moody atmospheric photography, 
cinematic quality, explorer journal mood. 
Colors: deep forest green (#0B2A22), warm gold (#D6A84F), 
sand parchment (#F5EFE3). 
NOT: neon, tropical beach party, cartoon, childish, oversaturated.
```

---

## 1. HERO SECTION — `/`

### IMG-001 · Hero Background (Full-bleed)
→ save as: `public/images/hero/hero-bg.jpg`  
→ dimensions: **1920 × 1080 px** (also export 1280×720 for mobile)  
→ usage: `HeroSection.tsx` full-bleed background with dark gradient overlay

```
Wide cinematic landscape of a misty Thai mountain range at dawn, 
Doi Inthanon style, sea of mist filling the valley below, 
dark deep forest green silhouette in foreground, golden hour light 
breaking through the clouds on the horizon, dramatic atmospheric haze, 
moody and majestic, shot with wide-angle lens, ultra-realistic 
photographic quality, 8K detail, no people, no text, 
deep forest green and gold color palette, parchment-warm tones.
Style: premium adventure collector aesthetic, Thai national park passport feel.
```

---

### IMG-002 · Hero Background — Mobile variant
→ save as: `public/images/hero/hero-bg-mobile.jpg`  
→ dimensions: **750 × 1334 px**  
→ usage: `HeroSection.tsx` — mobile breakpoint

```
Vertical cinematic portrait of a misty Thai mountain valley at dawn, 
tall vertical composition, sea of mist below a dark forested ridge, 
golden sunrise light filtering through dense cloud layers, 
deep forest green tones, warm gold horizon, no people, no text, 
dramatic and serene, ultra-realistic photographic quality.
Style: premium adventure collector aesthetic, Thai national park mood.
```

---

## 2. BOARD COVERS — `/boards` + `/boards/[slug]` + shop cards

### IMG-003 · Starter Quest Pack Board Cover
→ save as: `public/images/boards/starter-10.jpg`  
→ dimensions: **800 × 600 px** (4:3)  
→ usage: `BoardProductCard`, shop product image, `/boards/starter-10-parks`

```
Flat lay product photography of a premium A3 adventure quest board, 
parchment-colored background, printed map of Thailand with 10 national park 
location markers, compass rose detail, vintage explorer map aesthetic, 
warm golden accents, small enamel pin and QR activation card alongside, 
top-down view, studio lighting with soft shadows, no people, no text overlays, 
elegant collector item feel, deep forest green and gold ink on cream paper.
Style: premium Thai national park passport + collector board product shot.
```

---

### IMG-004 · Northern Park Quest Board Cover
→ save as: `public/images/boards/northern.jpg`  
→ dimensions: **800 × 600 px**  
→ usage: `BoardProductCard`, `/boards/northern-park-quest`

```
Cinematic aerial photograph of northern Thailand mountain landscape, 
Doi Inthanon or Doi Chiang Dao style, layers of misty forested ridges 
receding into the horizon, cool morning light, dense pine and mixed 
tropical forest, deep forest green tones with gold sunrise rim light, 
no people, no text, moody and majestic, ultra-realistic, 
atmospheric perspective creating depth.
Style: premium adventure collector, explorer journal mood.
```

---

### IMG-005 · Southern Marine Quest Board Cover
→ save as: `public/images/boards/southern-marine.jpg`  
→ dimensions: **800 × 600 px**  
→ usage: `BoardProductCard`, `/boards/southern-marine-quest`

```
Underwater photograph looking upward from below crystal clear turquoise water 
toward a limestone karst island silhouette above, Similan Islands or Phang Nga 
style, golden sunlight refracting through the water surface in god rays, 
a school of tropical fish mid-frame, deep navy to turquoise gradient, 
cinematic quality, premium nature photography, no people, no text, 
moody underwater explorer aesthetic.
Style: premium adventure collector, explorer journal mood.
```

---

### IMG-006 · Waterfall Quest Board Cover
→ save as: `public/images/boards/waterfall.jpg`  
→ dimensions: **800 × 600 px**  
→ usage: `BoardProductCard`, `/boards/waterfall-quest`

```
Long-exposure waterfall photograph in a lush Thai jungle, 
Erawan or Haew Narok style, silky smooth white water cascading 
over moss-covered limestone rocks into a crystal emerald pool, 
dense tropical forest framing both sides, dappled light filtering 
through canopy, rich deep green tones, no people, no text, 
cinematic nature photography, ultra-realistic, slow shutter mood.
Style: premium adventure collector, explorer journal aesthetic.
```

---

### IMG-007 · Sea of Mist Quest Board Cover
→ save as: `public/images/boards/sea-of-mist.jpg`  
→ dimensions: **800 × 600 px**  
→ usage: `BoardProductCard`, `/boards/sea-of-mist-quest`

```
Dramatic mountain viewpoint at 5am, dense white sea of mist 
completely filling the valley below, rocky peak emerging from mist 
in the foreground, first light of dawn on the horizon creating 
deep gold and amber tones above a deep purple-blue mist layer, 
lone pine tree silhouette on the rocky ledge, Phu Chi Fa style 
northern Thailand, no people, no text, cinematic ultra-realistic.
Style: premium adventure collector, misty mountain dawn aesthetic.
```

---

### IMG-008 · Ultimate 156 Parks Board Cover
→ save as: `public/images/boards/ultimate-156.jpg`  
→ dimensions: **800 × 600 px**  
→ usage: `BoardProductCard`, `/boards/ultimate-156-parks`

```
Top-down product photograph of a large premium A2 collector board 
showing all 156 Thai national parks mapped across Thailand's silhouette, 
intricate illustrated map style with hand-drawn terrain details, 
individual pin holes at each park location, some slots filled with 
tiny gold and emerald enamel pins, parchment-colored board on dark 
forest-green velvet surface, dramatic side lighting with long shadows, 
premium collector item aesthetic, no text overlays, gold foil accents.
Style: premium explorer passport + collector board product photography.
```

---

### IMG-009 · Gift Adventure Pack
→ save as: `public/images/boards/gift-pack.jpg`  
→ dimensions: **800 × 600 px**  
→ usage: shop product `/shop/gift-adventure-pack`

```
Luxurious flat lay product photography of a premium adventure gift set, 
open kraft box revealing a folded A3 quest board, 
6 enamel pins arranged in a velvet tray, a small leather passport booklet, 
sticker sheet, and QR activation card, all on a dark forest-green linen surface, 
warm gold accents throughout, studio overhead lighting, soft bokeh background, 
gift ribbon partially visible, no people, no text, luxury gift unboxing aesthetic.
Style: premium Thai national park collector gift, editorial product photography.
```

---

## 3. PARK PHOTOGRAPHY — Plans + Memories + Mission details

### IMG-010 · Doi Inthanon National Park
→ save as: `public/images/parks/doi-inthanon.jpg`  
→ dimensions: **1200 × 800 px**  
→ usage: plan covers, memory cards, mission detail pages

```
Cinematic wide-angle photograph at the summit of Doi Inthanon, 
Thailand's highest peak, at golden hour, 
misty cloud forest surrounding the royal twin pagodas (Naphamethinidon), 
soft morning mist swirling around the pagodas, 
warm gold light on the white and gold pagoda spires, 
lush green forest in foreground and background, 
ultra-realistic photographic quality, no people, atmospheric and majestic.
Style: premium adventure travel, Thai national park explorer aesthetic.
```

---

### IMG-011 · Khao Yai National Park
→ save as: `public/images/parks/khao-yai.jpg`  
→ dimensions: **1200 × 800 px**  
→ usage: plan covers, memory cards, mission pages

```
Cinematic wide photograph inside Khao Yai National Park, 
misty tropical forest with elephant silhouette at edge of clearing, 
golden morning light filtering through tall dipterocarp trees, 
lush green undergrowth, dramatic light beams through forest canopy, 
no text, ultra-realistic wildlife nature photography, 
deep forest tones, premium adventure editorial quality.
Style: premium Thai national park wildlife and jungle exploration.
```

---

### IMG-012 · Similan Islands / Richelieu Rock
→ save as: `public/images/parks/similan.jpg`  
→ dimensions: **1200 × 800 px**  
→ usage: plan covers, memory cards, marine quest boards

```
Underwater wide-angle photograph at Richelieu Rock, Surin Islands Thailand, 
whale shark silhouette in the background swimming toward the camera, 
colorful soft coral and sea fans in the foreground, 
clear deep blue water, dramatic god rays from surface above, 
premium underwater nature photography, ultra-realistic, cinematic quality, 
no text, teal and deep navy tones.
Style: premium underwater explorer, marine national park adventure.
```

---

### IMG-013 · Erawan Waterfall
→ save as: `public/images/parks/erawan.jpg`  
→ dimensions: **1200 × 800 px**  
→ usage: plan covers, memory cards

```
Photograph of Erawan Waterfall 7th tier, Kanchanaburi Thailand, 
crystal clear turquoise emerald pool fed by a cascading waterfall, 
tropical forest completely framing the scene, 
school of fish visible through clear shallow water in the pool, 
long exposure for silky water effect, lush deep green vegetation, 
golden dappled light through canopy, no people, no text, 
ultra-realistic cinematic nature photography.
Style: premium Thai waterfall jungle explorer aesthetic.
```

---

### IMG-014 · Phu Chi Fa / Morning Mist viewpoint
→ save as: `public/images/parks/phu-chi-fa.jpg`  
→ dimensions: **1200 × 800 px**  
→ usage: memory cards, sea-of-mist quest, plan detail

```
Dramatic viewpoint photograph at Phu Chi Fa, Chiang Rai Thailand, 
at first light, layered mountains rising above a sea of white mist 
that fills the valley completely, warm amber and gold sunrise tones 
on the upper mountain ridges, cool blue-purple tones in the mist below, 
lone tree silhouette on the rocky promontory in sharp foreground, 
ultra-realistic photographic quality, cinematic, no people, no text.
Style: premium adventure, misty mountain explorer atmosphere.
```

---

### IMG-015 · Doi Suthep National Park
→ save as: `public/images/parks/doi-suthep.jpg`  
→ dimensions: **1200 × 800 px**  
→ usage: northern quest board, memory cards

```
Wide-angle cinematic photograph of Wat Phrathat Doi Suthep, Chiang Mai, 
at golden hour from a distance showing the golden chedi (stupa) gleaming 
above the forested hillside, dramatic warm gold light on the pagoda, 
dark forest green hills in foreground, Chiang Mai city faintly visible 
in the valley below at dusk, no people, ultra-realistic, atmospheric.
Style: premium Thai cultural and natural explorer photography.
```

---

## 4. ENAMEL PINS — Shop + BadgePinCard component

### IMG-016 · Mountain Series Pin Set (6 pins)
→ save as: `public/images/pins/mountain-set.jpg`  
→ dimensions: **800 × 800 px** (square)  
→ usage: `/shop/mountain-pin-set`, `PinCollectionGrid`

```
Flat lay product photograph of 6 premium hard enamel pins 
arranged artfully on dark forest-green velvet, 
each pin depicts a different Thai mountain peak — 
Doi Inthanon, Doi Chiang Dao, Doi Pha Hom Pok, Phu Chi Fa, 
Phu Kradueng, Khao Luang — 
illustrated in a vintage national park badge style, 
1.5-inch round or shield shape each, gold metal base with 
colored enamel fill in forest green, gold, and cream tones, 
studio overhead lighting, slight shadow behind each pin, 
no text, premium collector product photography.
Style: vintage national park badge enamel pin collector aesthetic.
```

---

### IMG-017 · Marine / Coastal Pin Set (6 pins)
→ save as: `public/images/pins/marine-set.jpg`  
→ dimensions: **800 × 800 px**  
→ usage: shop, `PinCollectionGrid`

```
Flat lay product photograph of 6 premium hard enamel pins 
on white sand and ocean pebble surface, 
each pin depicts a different Thai marine park — 
whale shark, sea turtle, manta ray, Similan rock formation, 
coral reef cross-section, Tarutao lighthouse — 
vintage national park badge illustration style, 
1.5-inch shield and round shapes, 
teal, navy, and gold enamel on silver and gold metal base, 
overhead studio lighting, no text, premium collector product photography.
Style: vintage marine national park badge enamel pin collector aesthetic.
```

---

### IMG-018 · Waterfall / Forest Pin Set (6 pins)
→ save as: `public/images/pins/waterfall-set.jpg`  
→ dimensions: **800 × 800 px**  
→ usage: shop, `PinCollectionGrid`

```
Flat lay product photograph of 6 premium hard enamel pins 
arranged on mossy wet rock surface with small fern leaves, 
each pin depicts a famous Thai waterfall — 
Erawan 7-tier, Haew Narok, Mae Klong, Khlong Lan, 
Thararak, Namtok Phlio — 
vintage national park badge illustration style, 
emerald green and white enamel on gold metal base, 
1.5-inch shapes mixing circle and arrowhead, 
overhead studio lighting, natural texture background, no text.
Style: premium forest explorer enamel pin collector aesthetic.
```

---

### IMG-019 · Individual Pin — Doi Inthanon Completion Badge
→ save as: `public/images/pins/pin-doi-inthanon.jpg`  
→ dimensions: **400 × 400 px** (square)  
→ usage: `BadgePinCard` component, mission reward preview

```
Single premium 1.5-inch hard enamel pin, macro photography, 
shield shape with scalloped edge, 
depicts Doi Inthanon twin pagodas (Naphamethinidon) surrounded by 
cloud forest mist, text arc "DOI INTHANON" at top, 
"QUESTORY" at bottom in tiny serif font, 
deep forest green and gold enamel fill, 
gold metal plating, pin back visible, 
on parchment paper background with soft shadow, 
ultra-sharp macro product photography, premium collector item.
Style: vintage national park badge enamel pin collector.
```

---

### IMG-020 · Individual Pin — Khao Yai Wildlife Badge
→ save as: `public/images/pins/pin-khao-yai.jpg`  
→ dimensions: **400 × 400 px**  
→ usage: `BadgePinCard` component

```
Single premium 1.5-inch hard enamel pin, macro photography, 
round shape with rope border, 
depicts a Thai elephant walking through jungle with tall trees, 
full moon in background, 
text arc "KHAO YAI" at top, "WILDLIFE EXPLORER" at bottom, 
deep forest green, warm cream, and gold enamel, 
antique gold metal base with rubber pin back, 
on dark green velvet background with dramatic side lighting, 
ultra-sharp macro product photography, premium collector aesthetic.
Style: vintage national park badge enamel pin collector.
```

---

### IMG-021 · Individual Pin — Similan Islands Marine Badge
→ save as: `public/images/pins/pin-similan.jpg`  
→ dimensions: **400 × 400 px**  
→ usage: `BadgePinCard` component

```
Single premium 1.5-inch hard enamel pin, macro photography, 
teardrop or wave shape, 
depicts a whale shark swimming upward with sun rays above, 
coral and sea fan at the base, 
text "SIMILAN ISLANDS" curved at top, 
deep navy, teal, and gold enamel, 
silver metal base with butterfly clasp pin back, 
on pale sand and ocean pebble background, 
ultra-sharp macro product photography, premium collector feel.
Style: vintage marine national park badge enamel pin.
```

---

### IMG-022 · Locked Pin (silhouette state)
→ save as: `public/images/pins/pin-locked.jpg`  
→ dimensions: **400 × 400 px**  
→ usage: `BadgePinCard` locked state (grayscale overlay reference)

```
Single premium 1.5-inch hard enamel pin, macro photography, 
mysterious silhouette-only design suggesting a mountain peak shape, 
matte black enamel with subtle dark gray texture, 
no identifying detail visible, question mark subtly implied 
through the shape alone (no literal "?"), 
dark brooding product photography, 
on dark forest-green velvet background with minimal lighting, 
collector item that implies something hidden and valuable,
ultra-sharp macro photography, moody and premium.
Style: mystery collectible, hidden achievement aesthetic.
```

---

## 5. MEMORY WALL PHOTOS — `/memories` + homepage `MemoryWall`

### IMG-023 · User Memory — Morning Sea of Mist (mem-001)
→ save as: `public/images/memories/mem-001.jpg`  
→ dimensions: **600 × 450 px** (4:3)  
→ usage: `MemoryCard`, homepage MemoryWall

```
Personal travel photograph style, 
viewed from a mountain peak at 5am over a complete sea of mist, 
warm gold and pink dawn light on the cloud surface, 
hiker's silhouette from behind in foreground looking out, 
wearing a backpack, heavy jacket, warm breath visible, 
Doi Inthanon Thailand atmosphere, authentic travel memory feel, 
slightly warm-toned with vignette, not overly edited, 
feels like a real personal photo taken on a mirrorless camera.
Style: authentic adventure travel memory, personal journal photo.
```

---

### IMG-024 · User Memory — Underwater Whale Shark (mem-002)
→ save as: `public/images/memories/mem-002.jpg`  
→ dimensions: **600 × 450 px**  
→ usage: `MemoryCard`, homepage MemoryWall

```
Personal underwater travel photograph style, 
diver's POV shot looking up at a whale shark from below, 
whale shark filling the upper half of frame, 
diver's extended hand almost reaching the dorsal fin in excitement, 
sunlight refracting from surface above in radiating beams, 
teal blue water, authentic feel of a GoPro-style travel memory photo, 
slight underwater distortion, warm-cool color balance, 
feels like a genuine personal adventure memory photograph.
Style: authentic underwater travel memory, personal adventure journal photo.
```

---

### IMG-025 · User Memory — Erawan Falls pool (mem-003)
→ save as: `public/images/memories/mem-003.jpg`  
→ dimensions: **600 × 450 px**  
→ usage: `MemoryCard`, homepage MemoryWall

```
Personal travel photograph style from the edge of a crystal turquoise 
emerald pool at Erawan Waterfall 7th tier, Kanchanaburi Thailand, 
looking at the waterfall pouring into the pool, 
lush jungle framing, golden dappled light through canopy, 
authentic travel memory feel taken on a smartphone or mirrorless camera, 
slightly warm natural tones, genuinely looks like a real personal photo 
from a day trip, natural vignette.
Style: authentic casual travel memory, personal journal photo aesthetic.
```

---

### IMG-026 · User Memory — Phu Chi Fa Sunset (mem-004)
→ save as: `public/images/memories/mem-004.jpg`  
→ dimensions: **600 × 450 px**  
→ usage: `MemoryCard`, homepage MemoryWall

```
Personal travel photograph at Phu Chi Fa viewpoint, Chiang Rai Thailand, 
at sunset, photographer's shadow visible in bottom foreground, 
expansive valley of mist below turning deep amber and purple as sun sets, 
layered mountain ridges in warm gold and orange tones, 
lone tree silhouette at edge of cliff, 
authentic travel selfie-free perspective, 
genuine personal memory photograph aesthetic, 
natural imperfections expected, mirrorless quality.
Style: authentic adventure travel memory, personal explorer journal photo.
```

---

### IMG-027 · User Memory — Khao Yai Wild Elephants (mem-005)
→ save as: `public/images/memories/mem-005.jpg`  
→ dimensions: **600 × 450 px**  
→ usage: `MemoryCard`, homepage MemoryWall

```
Personal travel photograph taken through a car windshield, 
3 wild Asian elephants crossing the road inside Khao Yai National Park, 
Thai jungle road lined with tall trees on both sides, 
golden late afternoon light, one elephant turning to look at camera, 
authentic caught-the-moment travel memory feel, 
natural colors, slight windshield reflection adds authenticity, 
genuine personal photo taken in excitement.
Style: authentic wildlife travel memory, personal adventure journal photo.
```

---

### IMG-028 · User Memory — Starter Pack Completion (mem-006)
→ save as: `public/images/memories/mem-006.jpg`  
→ dimensions: **600 × 450 px**  
→ usage: `MemoryCard`, homepage MemoryWall

```
Personal flat lay photograph on a wooden table, 
completed A3 quest board with 10 park stickers all filled in, 
6 enamel pins displayed in their slots, 
small journal open showing park visit notes, 
a coffee cup in the corner, warm home lighting, 
proud achievement display, 
authentic "look what I accomplished" personal photo aesthetic, 
warm and cozy indoor atmosphere, genuine and personal.
Style: authentic achievement memory photo, collector's pride aesthetic.
```

---

## 6. HOW IT WORKS — Step illustrations for `HowItWorks.tsx`

### IMG-029 · Step 1 — Buy the Board
→ save as: `public/images/ui/step-buy.jpg`  
→ dimensions: **400 × 400 px** (square)  
→ usage: `HowItWorks` step icon/illustration

```
Minimal illustration of a premium adventure quest board being unboxed, 
top-down view of hands opening a premium kraft box revealing the A3 board 
with a QR activation card and enamel pin pouch, 
warm parchment and forest green tones, 
clean editorial flat-lay style, soft studio lighting, 
no text in image, elegant and premium feel.
Style: premium product editorial illustration, warm collector aesthetic.
```

---

### IMG-030 · Step 2 — Activate via QR
→ save as: `public/images/ui/step-activate.jpg`  
→ dimensions: **400 × 400 px**  
→ usage: `HowItWorks` step icon/illustration

```
Minimal lifestyle photograph of a hand holding a smartphone 
scanning a QR code on a physical quest card placed on wooden table, 
phone screen shows a glowing "Quest Activated!" interface, 
warm home desk atmosphere, forest green and gold accents, 
clean and simple composition, no cluttered background, 
soft window light from the side.
Style: premium lifestyle tech product photo, warm collector aesthetic.
```

---

### IMG-031 · Step 3 — Travel & Complete Missions
→ save as: `public/images/ui/step-travel.jpg`  
→ dimensions: **400 × 400 px**  
→ usage: `HowItWorks` step icon/illustration

```
Lifestyle photograph of a hiker from behind on a mountain trail 
in northern Thailand, wearing a backpack, 
checking a map app on their phone with trail ahead, 
lush green forested hills in background, 
golden morning light, adventurous and motivated mood, 
no face visible — from behind only, 
clean editorial composition, no clutter, warm forest tones.
Style: premium adventure travel lifestyle, explorer aesthetic.
```

---

### IMG-032 · Step 4 — Collect Pins & Share
→ save as: `public/images/ui/step-collect.jpg`  
→ dimensions: **400 × 400 px**  
→ usage: `HowItWorks` step icon/illustration

```
Lifestyle photograph of a hand proudly displaying 
a small collector board with 5 enamel pins attached, 
each pin a different Thai national park design, 
bokeh background of forest green and warm indoor light, 
pride of achievement feel, 
warm gold and forest green color palette, 
clean editorial product-lifestyle style.
Style: premium collector achievement lifestyle photo, warm explorer aesthetic.
```

---

## 7. USER AVATARS — Plans, Memory Wall, Admin

### IMG-033 · Creator Avatar 1 — Chayachai
→ save as: `public/images/avatars/avatar-01.jpg`  
→ dimensions: **200 × 200 px** (square, will be cropped circular)  
→ usage: plan creator card, dashboard greeting

```
Portrait photo style of a young Thai male traveler, 
25-30 years old, warm smile, outdoors background blurred, 
wearing a casual hiking jacket, natural outdoor lighting, 
professional headshot framing from shoulders up, 
authentic and friendly, warm skin tones, forest background.
Style: authentic travel personality portrait, friendly explorer vibe.
NOT: stock photo feel, over-retouched, formal.
```

---

### IMG-034 · Creator Avatar 2 — Mintra
→ save as: `public/images/avatars/avatar-02.jpg`  
→ dimensions: **200 × 200 px**  
→ usage: plan creator card

```
Portrait photo style of a young Thai female traveler, 
25-30 years old, confident and adventurous expression, 
outdoors at a park or viewpoint, natural background blur, 
casual outdoor clothing, golden hour natural lighting, 
warm and genuine, from shoulders up.
Style: authentic travel personality portrait, confident explorer vibe.
NOT: stock photo feel, formal portrait, over-edited.
```

---

### IMG-035 · Creator Avatar 3 — Natcha
→ save as: `public/images/avatars/avatar-03.jpg`  
→ dimensions: **200 × 200 px**  
→ usage: plan creator card

```
Portrait photo style of a young Thai female explorer, 
22-28 years old, with a playful and adventurous smile, 
outdoors near a beach or coastal park, 
casual clothing, natural light with slight ocean background blur, 
energetic and approachable personality.
Style: authentic marine travel personality portrait, adventurer vibe.
NOT: stock photo feel, formal.
```

---

## 8. 404 + ERROR PAGES — `not-found.tsx` / `global-error.tsx`

### IMG-036 · 404 Explorer Illustration
→ save as: `public/images/ui/explorer-404.png`  
→ dimensions: **400 × 400 px** (PNG with transparent background)  
→ usage: `not-found.tsx` page illustration

```
Flat vector illustration style of a small explorer character 
standing at a misty forest crossroads with multiple paths, 
holding a map and looking confused but still cheerful, 
wearing a vintage explorer hat and backpack, 
surrounded by tall forest trees, small compass in hand, 
warm parchment and forest green color palette, 
soft rounded illustration style, no text, 
charming and friendly — lost but adventurous.
Style: premium illustrated explorer character, national park adventure aesthetic.
```

---

### IMG-037 · 500 Error Illustration
→ save as: `public/images/ui/error-500.png`  
→ dimensions: **400 × 400 px** (PNG with transparent background)  
→ usage: `global-error.tsx` page illustration

```
Flat vector illustration style of a small explorer character 
sitting next to a broken compass on a parchment map, 
the compass needle is spinning wildly, 
character has a puzzled but patient expression, 
forest trees in the background, warm inviting colors, 
parchment paper, forest green and gold palette, 
no text in illustration, charming and minimal.
Style: premium illustrated explorer character, adventure journal aesthetic.
```

---

## 9. OG IMAGES — Social media preview cards

### IMG-038 · Default OG Image (homepage / fallback)
→ save as: `public/og-default.png`  
→ dimensions: **1200 × 630 px**  
→ usage: `src/app/og-default/route.tsx`, fallback for all pages

```
Premium social media preview card design (1200x630 landscape), 
dark forest green (#0B2A22) background with subtle misty mountain 
silhouette texture overlaid at low opacity, 
centered large white serif text "Questory" 
with gold Thai subtitle "เก็บภารกิจ สะสม Pin ทั่วประเทศไทย", 
small compass icon in gold above the text, 
bottom strip shows 3 small enamel pin previews with park names, 
top-left corner has "NPQ" logo mark in gold, 
premium editorial layout, no photographic elements clashing.
Style: premium brand social card, national park collector aesthetic.
```

---

### IMG-039 · OG Image — Boards page
→ save as: `public/og-boards.png`  
→ dimensions: **1200 × 630 px**  
→ usage: `src/app/og-boards/route.tsx`

```
Premium social media preview card design (1200x630 landscape), 
split composition: left half shows a beautiful top-down photo of 
an A3 quest board with enamel pins placed, 
right half has dark forest green (#0B2A22) background with 
large bold white text "Quest Boards" and smaller text 
"6 collections · 10 to 156 missions", 
gold "NPQ" brand mark top-right, clean editorial layout, 
premium product lifestyle feel.
Style: premium brand social card, adventure collector product aesthetic.
```

---

### IMG-040 · OG Image — Plans page
→ save as: `public/og-plans.png`  
→ dimensions: **1200 × 630 px**  
→ usage: `src/app/og-plans/route.tsx`

```
Premium social media preview card design (1200x630 landscape), 
left two-thirds: cinematic misty mountain landscape of northern Thailand 
with dark green gradient overlay, 
right third: dark forest green panel with white serif text "Travel Plans", 
gold subtitle "Copy · Explore · Quest", 
small compass and route line icon in gold above text, 
"NPQ" brand mark visible, editorial and premium layout.
Style: premium brand social card, adventure travel map aesthetic.
```

---

## 10. PRODUCT SHOP — Additional items

### IMG-041 · Quest Sticker Sheet
→ save as: `public/images/products/sticker-sheet.jpg`  
→ dimensions: **800 × 600 px**  
→ usage: `/shop` sticker product

```
Flat lay product photograph of a premium holographic sticker sheet, 
A5 size, featuring 20 individual illustrated stickers each depicting 
a different Thai national park — mountains, waterfalls, marine parks, 
wildlife, jungle temples — vintage national park badge illustration style, 
parchment background, soft studio lighting from the side, 
slight holographic shimmer visible on the sticker sheet, 
no text overlaid on photo, clean product photography.
Style: premium collector sticker product photography, national park aesthetic.
```

---

### IMG-042 · Digital Quest Passport Booklet
→ save as: `public/images/products/passport-booklet.jpg`  
→ dimensions: **800 × 600 px**  
→ usage: `/shop` passport product

```
Product photograph of a small premium leather-look passport booklet, 
A6 size, embossed "QUESTORY" on the cover in gold foil, 
compass rose emblem below the text, 
opened page showing stamp-style park visit record with 
a few circular park stamp impressions, 
on dark forest green fabric background, 
warm side lighting, elegant and premium feel, 
no text overlaid on photo.
Style: premium travel passport collector product photography.
```

---

## 11. AI PLANNER PAGE — `/app/ai-planner`

### IMG-043 · AI Planner Illustration / Banner
→ save as: `public/images/ui/ai-planner-banner.jpg`  
→ dimensions: **1200 × 400 px**  
→ usage: `src/app/(app)/app/ai-planner/page.tsx` header banner

```
Wide cinematic illustration-style image, 
a glowing digital map of Thailand overlaid on a misty mountainscape, 
golden route lines connecting national park icons across the map, 
AI planning feel — subtle circuit-line patterns in forest green, 
warm gold glow emanating from the route connections, 
premium and futuristic but grounded in nature, 
no text, wide banner proportions (3:1 ratio), 
deep forest green and gold palette, premium adventure tech aesthetic.
Style: premium AI travel planner visualization, national park explorer aesthetic.
```

---

## QUICK REFERENCE — File Path Map

| ID | File Path | Used In |
|---|---|---|
| IMG-001 | `public/images/hero/hero-bg.jpg` | `HeroSection.tsx` |
| IMG-002 | `public/images/hero/hero-bg-mobile.jpg` | `HeroSection.tsx` mobile |
| IMG-003 | `public/images/boards/starter-10.jpg` | Board/Product cards |
| IMG-004 | `public/images/boards/northern.jpg` | Board cards |
| IMG-005 | `public/images/boards/southern-marine.jpg` | Board cards |
| IMG-006 | `public/images/boards/waterfall.jpg` | Board cards |
| IMG-007 | `public/images/boards/sea-of-mist.jpg` | Board cards |
| IMG-008 | `public/images/boards/ultimate-156.jpg` | Board cards |
| IMG-009 | `public/images/boards/gift-pack.jpg` | Shop product |
| IMG-010 | `public/images/parks/doi-inthanon.jpg` | Plans / Memories |
| IMG-011 | `public/images/parks/khao-yai.jpg` | Plans / Memories |
| IMG-012 | `public/images/parks/similan.jpg` | Plans / Memories |
| IMG-013 | `public/images/parks/erawan.jpg` | Plans / Memories |
| IMG-014 | `public/images/parks/phu-chi-fa.jpg` | Plans / Memories |
| IMG-015 | `public/images/parks/doi-suthep.jpg` | Plans / Memories |
| IMG-016 | `public/images/pins/mountain-set.jpg` | Shop / PinGrid |
| IMG-017 | `public/images/pins/marine-set.jpg` | Shop / PinGrid |
| IMG-018 | `public/images/pins/waterfall-set.jpg` | Shop / PinGrid |
| IMG-019 | `public/images/pins/pin-doi-inthanon.jpg` | `BadgePinCard` |
| IMG-020 | `public/images/pins/pin-khao-yai.jpg` | `BadgePinCard` |
| IMG-021 | `public/images/pins/pin-similan.jpg` | `BadgePinCard` |
| IMG-022 | `public/images/pins/pin-locked.jpg` | `BadgePinCard` locked |
| IMG-023 | `public/images/memories/mem-001.jpg` | `MemoryCard` / MemoryWall |
| IMG-024 | `public/images/memories/mem-002.jpg` | `MemoryCard` / MemoryWall |
| IMG-025 | `public/images/memories/mem-003.jpg` | `MemoryCard` / MemoryWall |
| IMG-026 | `public/images/memories/mem-004.jpg` | `MemoryCard` / MemoryWall |
| IMG-027 | `public/images/memories/mem-005.jpg` | `MemoryCard` / MemoryWall |
| IMG-028 | `public/images/memories/mem-006.jpg` | `MemoryCard` / MemoryWall |
| IMG-029 | `public/images/ui/step-buy.jpg` | `HowItWorks` step 1 |
| IMG-030 | `public/images/ui/step-activate.jpg` | `HowItWorks` step 2 |
| IMG-031 | `public/images/ui/step-travel.jpg` | `HowItWorks` step 3 |
| IMG-032 | `public/images/ui/step-collect.jpg` | `HowItWorks` step 4 |
| IMG-033 | `public/images/avatars/avatar-01.jpg` | Plan creator card |
| IMG-034 | `public/images/avatars/avatar-02.jpg` | Plan creator card |
| IMG-035 | `public/images/avatars/avatar-03.jpg` | Plan creator card |
| IMG-036 | `public/images/ui/explorer-404.png` | `not-found.tsx` |
| IMG-037 | `public/images/ui/error-500.png` | `global-error.tsx` |
| IMG-038 | `public/og-default.png` | OG fallback |
| IMG-039 | `public/og-boards.png` | `/boards` OG |
| IMG-040 | `public/og-plans.png` | `/plans` OG |
| IMG-041 | `public/images/products/sticker-sheet.jpg` | Shop |
| IMG-042 | `public/images/products/passport-booklet.jpg` | Shop |
| IMG-043 | `public/images/ui/ai-planner-banner.jpg` | AI Planner page |

---

## GENERATION NOTES

**ChatGPT DALL·E 3 workflow:**
1. เปิด ChatGPT → เลือก DALL·E 3 (GPT-4o)
2. พิมพ์ `Generate this image:` แล้วตามด้วย prompt ข้างต้น
3. ต่อท้ายทุก prompt ด้วย brand style guide block ด้านบน (BRAND STYLE GUIDE)
4. ขอ `--ar 16:9` หรือ `--ar 4:3` ตามขนาดที่ระบุ
5. บันทึกไฟล์ตาม path ที่ระบุใน `→ save as`

**Midjourney workflow:**
- ต่อท้าย prompt ด้วย `--style raw --v 6.1`
- ใส่ negative prompt: `--no text, watermark, logo, neon, bright, oversaturated, cartoon`
- Board covers + hero ใช้ `--ar 4:3` หรือ `--ar 16:9`
- Pin macros ใช้ `--ar 1:1`
- OG images ใช้ `--ar 1200:630`

**Priority order สำหรับทำก่อน:**
1. IMG-001 (hero-bg) — มีผลต่อ first impression มากที่สุด
2. IMG-003, 004, 006, 007, 008 (board covers) — ขาย product หลัก
3. IMG-019 to 022 (pins) — สำคัญสำหรับ collectible feel
4. IMG-029 to 032 (how-it-works steps) — onboarding UX
5. IMG-023 to 028 (memories) — social proof section
