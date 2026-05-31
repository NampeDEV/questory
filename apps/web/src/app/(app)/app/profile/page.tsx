import type { Metadata } from 'next';
import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BadgePill } from '@/components/ui/BadgePill';
import { Card } from '@/components/ui/Card';
import { getUserPins } from '@/lib/api/pins';
import {
  MapPin, Image as ImageIcon, Award, Share2,
  ChevronRight, Settings, ShieldCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'โปรไฟล์นักสำรวจของคุณ',
};

// Mock user data (RULE-005)
const mockUser = {
  displayName: 'Chayachai',
  email: 'chayachai@example.com',
  joinedAt: '2026-01-15T00:00:00Z',
  explorerLevel: 2,
  stats: {
    parks: 3,
    memories: 4,
    completedMissions: 3,
  },
  isPublicProfile: false,
};

const explorerLevels = [
  { level: 1, title: 'เริ่มต้น Explorer',  min: 0,  max: 5 },
  { level: 2, title: 'Explorer',           min: 5,  max: 15 },
  { level: 3, title: 'Trailblazer',        min: 15, max: 30 },
  { level: 4, title: 'Park Ranger',        min: 30, max: 50 },
  { level: 5, title: 'Legend',             min: 50, max: 77 },
];

// FE-PAGE-PROFILE (SPEC-08)
export default async function ProfilePage() {
  const allPins = await getUserPins();
  const unlockedPins = allPins.filter((p) => p.status !== 'locked');

  const currentLevel = explorerLevels.find((l) => l.level === mockUser.explorerLevel) ?? explorerLevels[0]!;
  const nextLevel    = explorerLevels.find((l) => l.level === mockUser.explorerLevel + 1);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-800 text-2xl font-bold text-white">
          {mockUser.displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-forest-900">{mockUser.displayName}</h1>
          <p className="text-sm text-muted">{mockUser.email}</p>
          <p className="mt-0.5 text-xs text-muted">
            เข้าร่วมตั้งแต่ {new Date(mockUser.joinedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Explorer level */}
      <Card className="mt-5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <BadgePill variant="rare">Level {currentLevel.level}</BadgePill>
            <p className="mt-1 font-semibold text-forest-900">{currentLevel.title}</p>
          </div>
          <ShieldCheck size={28} className="text-gold-500" aria-hidden="true" />
        </div>
        {nextLevel && (
          <div className="mt-3">
            <ProgressBar
              value={mockUser.stats.completedMissions - currentLevel.min}
              max={nextLevel.min - currentLevel.min}
              label={`${mockUser.stats.completedMissions} / ${nextLevel.min} ภารกิจ → Level ${nextLevel.level}`}
              size="sm"
            />
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: MapPin,    label: 'อุทยาน',     value: mockUser.stats.parks },
          { icon: ImageIcon, label: 'ความทรงจำ',  value: mockUser.stats.memories },
          { icon: Award,     label: 'Pin',         value: unlockedPins.length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-forest-800/10 bg-white/70 p-3 text-center">
            <Icon size={18} className="mx-auto text-forest-700" aria-hidden="true" />
            <p className="mt-1 text-xl font-bold text-forest-900">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Share link toggle */}
      <Card className="mt-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-forest-700" aria-hidden="true" />
            <p className="text-sm font-semibold text-forest-900">โปรไฟล์สาธารณะ</p>
          </div>
          <button
            aria-label={mockUser.isPublicProfile ? 'ปิดโปรไฟล์สาธารณะ' : 'เปิดโปรไฟล์สาธารณะ'}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              mockUser.isPublicProfile ? 'bg-forest-700' : 'bg-sand-200'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                mockUser.isPublicProfile ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        {mockUser.isPublicProfile && (
          <p className="mt-2 text-xs text-muted break-all">
            questory.app/p/{mockUser.displayName.toLowerCase()}
          </p>
        )}
      </Card>

      {/* Settings links */}
      <div className="mt-4 space-y-1">
        {[
          { label: 'ตั้งค่าบัญชี', href: '/app/profile/settings', icon: Settings },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between rounded-xl border border-forest-800/10 bg-white/70 px-4 py-3 text-sm font-medium text-forest-900 hover:bg-sand-100"
          >
            <span className="flex items-center gap-2">
              <Icon size={16} className="text-forest-700" aria-hidden="true" />
              {label}
            </span>
            <ChevronRight size={16} className="text-muted" aria-hidden="true" />
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <div className="mt-6 text-center">
        <button className="text-sm text-danger hover:underline">ออกจากระบบ</button>
      </div>
    </div>
  );
}
