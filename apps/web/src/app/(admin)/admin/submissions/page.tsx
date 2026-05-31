import type { Metadata } from 'next';
import { SubmissionsTable } from './SubmissionsTable';

export const metadata: Metadata = { title: 'Admin — ตรวจสอบหลักฐาน | Questory Admin' };

// ADMIN-050 (TASK_ADMIN) — Submissions page: photo viewer + approve/reject drawer
const MOCK_SUBMISSIONS = [
  {
    id: 'sub-001',
    user: 'ณัฐวุฒิ แสงทอง',
    userHandle: '@nuttawut.93',
    mission: 'ดอยอินทนนท์ — ยอดดอยสูงสุดในไทย',
    park: 'อุทยานแห่งชาติดอยอินทนนท์',
    photoUrl: '/images/parks/doi-inthanon.jpg',
    note: 'ขึ้นถึงยอดดอยแล้วครับ วิวสวยมาก',
    status: 'submitted',
    date: '2026-05-30 10:21',
  },
  {
    id: 'sub-002',
    user: 'ศิริพร อันทรดี',
    userHandle: '@siriporn.jd',
    mission: 'เขาใหญ่ — สัมผัสธรรมชาติ UNESCO',
    park: 'อุทยานแห่งชาติเขาใหญ่',
    photoUrl: '/images/parks/khao-yai.jpg',
    note: 'เจอช้างป่าตรงเส้นทางด้วยค่ะ',
    status: 'approved',
    date: '2026-05-29 09:58',
  },
  {
    id: 'sub-003',
    user: 'Akira Tanaka',
    userHandle: '@akira.tnk',
    mission: 'เอราวัณ — น้ำตก 7 ชั้น',
    park: 'อุทยานแห่งชาติเอราวัณ',
    photoUrl: '/images/parks/erawan.jpg',
    note: 'ขึ้นถึงชั้น 7 แล้วครับ!',
    status: 'submitted',
    date: '2026-05-28 14:30',
  },
  {
    id: 'sub-004',
    user: 'พรทิพย์ รักไทย',
    userHandle: '@pornthip.rt',
    mission: 'หมู่เกาะสิมิลัน — ใต้ทะเลสวรรค์',
    park: 'อุทยานแห่งชาติหมู่เกาะสิมิลัน',
    photoUrl: '/images/parks/similan.jpg',
    note: '',
    status: 'rejected',
    date: '2026-05-27 08:15',
  },
  {
    id: 'sub-005',
    user: 'สมชาย วีระกุล',
    userHandle: '@somchai.vk',
    mission: 'ภูกระดึง — ยอดผา 1325 ม.',
    park: 'อุทยานแห่งชาติภูกระดึง',
    photoUrl: '/images/parks/doi-inthanon.jpg',
    note: 'ขึ้นเองไม่มีไกด์นะครับ',
    status: 'submitted',
    date: '2026-05-26 07:00',
  },
] as const;

export type MockSubmission = (typeof MOCK_SUBMISSIONS)[number];

export default function SubmissionsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-forest-900">ตรวจสอบหลักฐาน</h1>
        <p className="mt-1 text-sm text-muted">ตรวจสอบและอนุมัติรูปภาพหลักฐานภารกิจของผู้ใช้</p>
      </div>
      <SubmissionsTable submissions={[...MOCK_SUBMISSIONS]} />
    </div>
  );
}
