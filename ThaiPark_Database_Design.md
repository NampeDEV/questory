# ThaiPark Database Design Analysis

## Overview

Reverse-engineered database design based on ThaiPark application screenshots.

## ER Diagram

```text
Region
 └── Province
       └── NationalPark
               ├── ParkImage
               ├── ParkFee
               ├── ParkWeather
               ├── ParkAQI
               ├── ParkLocation
               ├── ParkFacility
               ├── ParkSeason
               ├── ParkCheckIn
               ├── ParkReview
               └── ParkFavorite

User
 ├── ParkCheckIn
 ├── ParkFavorite
 └── ParkReview
```

---

# regions

| Column | Type |
|----------|----------|
| id | uuid |
| name_th | text |
| name_en | text |
| created_at | timestamp |

---

# provinces

| Column | Type |
|----------|----------|
| id | uuid |
| region_id | fk |
| province_name_th | text |
| province_name_en | text |
| latitude | decimal |
| longitude | decimal |

---

# national_parks

| Column | Type |
|----------|----------|
| id | uuid |
| park_code | varchar |
| name_th | text |
| name_en | text |
| description | text |
| province_id | fk |
| region_id | fk |
| cover_image | text |
| latitude | decimal |
| longitude | decimal |
| map_url | text |
| status | active/inactive |
| total_reviews | int |
| avg_rating | decimal |
| created_at | timestamp |

---

# park_images

| Column | Type |
|----------|----------|
| id | uuid |
| park_id | fk |
| image_url | text |
| image_type | cover/gallery |
| sort_order | int |

---

# park_places

| Column | Type |
|----------|----------|
| id | uuid |
| park_id | fk |
| place_name | text |
| description | text |
| category | text |
| latitude | decimal |
| longitude | decimal |
| image_url | text |
| status | text |

Categories:

- camping
- waterfall
- cave
- viewpoint
- trail
- forest
- lake
- other

---

# park_place_seasons

| Column | Type |
|----------|----------|
| id | uuid |
| place_id | fk |
| open_date | date |
| close_date | date |
| is_open | boolean |
| note | text |

---

# user_place_notifications

| Column | Type |
|----------|----------|
| id | uuid |
| user_id | fk |
| place_id | fk |
| created_at | timestamp |

---

# park_fees

| Column | Type |
|----------|----------|
| id | uuid |
| park_id | fk |
| nationality_type | text |
| age_group | text |
| price | decimal |

---

# weather_cache

| Column | Type |
|----------|----------|
| id | uuid |
| park_id | fk |
| temperature | decimal |
| weather_main | text |
| weather_description | text |
| icon | text |
| updated_at | timestamp |

---

# air_quality

| Column | Type |
|----------|----------|
| id | uuid |
| park_id | fk |
| pm25 | decimal |
| aqi_level | text |
| description | text |
| updated_at | timestamp |

---

# users

| Column | Type |
|----------|----------|
| id | uuid |
| email | text |
| display_name | text |
| profile_image | text |
| created_at | timestamp |

---

# park_checkins

| Column | Type |
|----------|----------|
| id | uuid |
| user_id | fk |
| park_id | fk |
| latitude | decimal |
| longitude | decimal |
| checkin_time | timestamp |
| verification_type | text |
| device_id | text |

Verification Types:

- gps
- qr
- manual

---

# park_reviews

| Column | Type |
|----------|----------|
| id | uuid |
| user_id | fk |
| park_id | fk |
| rating | decimal |
| review_text | text |
| created_at | timestamp |

---

# user_favorites

| Column | Type |
|----------|----------|
| id | uuid |
| user_id | fk |
| park_id | fk |

---

# park_map_markers

| Column | Type |
|----------|----------|
| id | uuid |
| park_id | fk |
| latitude | decimal |
| longitude | decimal |
| marker_icon | text |
| marker_color | text |

---

# Achievement Extension

## achievements

| Column |
|----------|
| id |
| title |
| description |
| badge_icon |
| rarity |
| xp_reward |

## user_achievements

| Column |
|----------|
| id |
| user_id |
| achievement_id |
| unlocked_at |

## quests

| Column |
|----------|
| id |
| title |
| quest_type |
| target_count |
| xp_reward |

## user_quests

| Column |
|----------|
| id |
| user_id |
| quest_id |
| progress |
| completed |

## province_completion

| Column |
|----------|
| id |
| user_id |
| province_id |
| completed |

## travel_memories

| Column |
|----------|
| id |
| user_id |
| park_id |
| image_url |
| caption |
| visit_date |

---

# Recommended Production Tables

1. users
2. regions
3. provinces
4. national_parks
5. park_images
6. park_places
7. park_place_seasons
8. park_fees
9. weather_cache
10. air_quality
11. park_checkins
12. park_reviews
13. user_favorites
14. achievements
15. user_achievements
16. quests
17. user_quests
18. travel_memories
19. leaderboards
20. notifications
21. badges

## Suggested Tech Stack

- Flutter
- Supabase
- PostgreSQL + PostGIS
- OpenWeather API
- Firebase Push Notification
- Mapbox / Google Maps
