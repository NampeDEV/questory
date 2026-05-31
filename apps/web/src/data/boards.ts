import type { BoardTemplate } from '@/types/board';

// Mock board templates (RULE-005, SPEC-06)
export const boardTemplates: BoardTemplate[] = [
  {
    id: 'bt-001',
    slug: 'starter-10-parks',
    name: 'Starter Quest Pack',
    description:
      'เริ่มต้นการผจญภัยกับ 10 อุทยานแห่งชาติที่เหมาะสำหรับผู้เริ่มต้น ครอบคลุมทุกภูมิภาคของประเทศไทย',
    category: 'starter',
    questCount: 10,
    coverImageUrl: '/images/boards/starter-10.jpg',
    priceThb: 990,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'bt-002',
    slug: 'northern-park-quest',
    name: 'Northern Park Quest',
    description:
      'สำรวจอุทยานแห่งชาติภาคเหนือ ดอยอินทนนท์ ดอยสุเทพ-ปุย และอีกมากมาย 20 ภารกิจที่รอคุณ',
    category: 'regional',
    questCount: 20,
    coverImageUrl: '/images/boards/northern.jpg',
    priceThb: 1490,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'bt-003',
    slug: 'southern-marine-quest',
    name: 'Southern Marine Quest',
    description:
      'ดำดิ่งสู่ความมหัศจรรย์ใต้ท้องทะเล อุทยานแห่งชาติทางทะเลภาคใต้ 18 ภารกิจ',
    category: 'regional',
    questCount: 18,
    coverImageUrl: '/images/boards/southern-marine.jpg',
    priceThb: 1690,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'bt-004',
    slug: 'waterfall-quest',
    name: 'Waterfall Quest',
    description:
      'ตามล่าหาน้ำตกที่งดงามที่สุดในประเทศไทย 15 น้ำตกจาก 4 ภูมิภาค',
    category: 'regional',
    questCount: 15,
    coverImageUrl: '/images/boards/waterfall.jpg',
    priceThb: 1490,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'bt-005',
    slug: 'sea-of-mist-quest',
    name: 'Sea of Mist Quest',
    description:
      'ยอดดอยและทะเลหมอกที่สวยงาม ประสบการณ์เหนือเมฆ 12 ภารกิจสุดตื่นเต้น',
    category: 'regional',
    questCount: 12,
    coverImageUrl: '/images/boards/sea-of-mist.jpg',
    priceThb: 1490,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'bt-006',
    slug: 'ultimate-156-parks',
    name: 'Ultimate 156 Parks',
    description:
      'ครบทุกอุทยานแห่งชาติในประเทศไทย สำหรับนักสะสมตัวจริงที่ต้องการพิชิตทุกจุดบนแผนที่',
    category: 'ultimate',
    questCount: 156,
    coverImageUrl: '/images/boards/ultimate-156.jpg',
    priceThb: 2990,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
];
