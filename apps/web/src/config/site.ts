// Site-wide static config (STACK-006)
export const siteConfig = {
  name: 'Questory',
  taglineEn: 'Turn Every Journey into an Achievement',
  taglineTh: 'ออกเดินทาง เก็บภารกิจ สร้างความทรงจำ และสะสม Pin จากอุทยานไทย',
  url: process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000',
  description:
    'Questory ระบบภารกิจอุทยานแห่งชาติไทย ซื้อบอร์ด สแกน QR ทำภารกิจ รับ Badge สะสม Pin',
  keywords: ['national park', 'อุทยานแห่งชาติ', 'thailand', 'quest', 'pin', 'badge', 'travel'],
} as const;

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Boards', href: '/boards' },
  { label: 'Plans', href: '/plans' },
  { label: 'Memories', href: '/memories' },
  { label: 'Creators', href: '/quests' },
  { label: 'Shop', href: '/shop' },
] as const;

export const appNavLinks = [
  { label: 'หน้าหลัก', href: '/app', icon: 'Home' },
  { label: 'บอร์ด', href: '/app/boards', icon: 'LayoutGrid' },
  { label: 'ภารกิจ', href: '/app/missions', icon: 'Compass' },
  { label: 'Pin', href: '/app/pins', icon: 'Pin' },
  { label: 'โปรไฟล์', href: '/app/profile', icon: 'User' },
] as const;
