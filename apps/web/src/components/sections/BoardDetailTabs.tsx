'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Award, Package, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatThb } from '@/lib/utils/format-thb';
import { cn } from '@/lib/utils/cn';
import type { BoardTemplate } from '@/types/board';

type TabId = 'overview' | 'missions' | 'rewards' | 'whats-in-box';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'overview',     label: 'Overview' },
  { id: 'missions',     label: 'Missions' },
  { id: 'rewards',      label: 'Rewards' },
  { id: 'whats-in-box', label: "What's in the box" },
];

const MOCK_MISSIONS = [
  { id: 'm1', name: 'พิชิตยอดดอยสูงสุด', difficulty: 'hard' },
  { id: 'm2', name: 'เดินป่าน้ำตกสาย', difficulty: 'medium' },
  { id: 'm3', name: 'สังเกตนกป่าดิบเขา', difficulty: 'easy' },
  { id: 'm4', name: 'บันทึกพืชหายาก', difficulty: 'easy' },
  { id: 'm5', name: 'ข้ามสะพานแขวนป่า', difficulty: 'medium' },
  { id: 'm6', name: 'ค้นพบถ้ำลับ', difficulty: 'hard' },
] as const;

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   'bg-success/10 text-success',
  medium: 'bg-gold-500/10 text-gold-700',
  hard:   'bg-danger/10 text-danger',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'ง่าย', medium: 'ปานกลาง', hard: 'ยาก',
};

const REWARD_PINS = [
  { id: 'p1', emoji: '⛰️', name: 'Summit Pin', rarity: 'epic' },
  { id: 'p2', emoji: '🌊', name: 'Waterfall Pin', rarity: 'rare' },
  { id: 'p3', emoji: '🌿', name: 'Forest Pin', rarity: 'uncommon' },
  { id: 'p4', emoji: '🦅', name: 'Eagle Pin', rarity: 'legendary' },
  { id: 'p5', emoji: '⬡', name: '???', rarity: 'common' },
  { id: 'p6', emoji: '⬡', name: '???', rarity: 'common' },
];

const RARITY_COLORS: Record<string, string> = {
  common:    'border-muted/30',
  uncommon:  'border-success',
  rare:      'border-gold-500',
  epic:      'border-moss-600',
  legendary: 'border-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.4)]',
};

const BOX_ITEMS = [
  { icon: '🗺️', name: 'Board A3 คุณภาพสูง', detail: 'พิมพ์ 4 สี กันน้ำ' },
  { icon: '📱', name: 'QR Activation Card', detail: 'เปิดใช้งานดิจิตอล' },
  { icon: '🏅', name: 'Pin Slot Card', detail: 'ช่อง Claim Pin ทุกภารกิจ' },
  { icon: '📖', name: 'Mini Guide Booklet', detail: 'เคล็ดลับเดินทาง' },
  { icon: '🎨', name: 'Sticker Sheet', detail: 'สติกเกอร์ประดับบอร์ด' },
];

type BoardDetailTabsProps = {
  board: BoardTemplate;
};

export function BoardDetailTabs({ board }: BoardDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <>
      {/* Tab bar */}
      <div className="sticky top-16 z-10 border-b border-forest-800/10 bg-parchment/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex gap-6 overflow-x-auto" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-shrink-0 border-b-2 py-4 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-forest-800 text-forest-900'
                    : 'border-transparent text-muted hover:text-forest-900',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">

            {/* Overview */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="font-serif text-xl font-bold text-forest-900">
                  {board.questCount} ภารกิจรอคุณอยู่
                </h2>
                <p className="mt-3 leading-relaxed text-ink/80">{board.description}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: MapPin, label: 'จำนวนภารกิจ', value: `${board.questCount} ภารกิจ` },
                    { icon: Award, label: 'หมวดหมู่', value: board.category },
                    { icon: List, label: 'ระดับ', value: board.category === 'starter' ? 'เหมาะสำหรับผู้เริ่มต้น' : 'ทุกระดับ' },
                    { icon: Package, label: 'ราคา', value: `${board.priceThb.toLocaleString('th-TH')} บาท` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg border border-forest-800/10 bg-white/60 p-4">
                      <Icon size={18} className="flex-shrink-0 text-forest-600" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-muted">{label}</p>
                        <p className="font-medium text-forest-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missions */}
            {activeTab === 'missions' && (
              <div>
                <h2 className="font-serif text-xl font-bold text-forest-900">ภารกิจในชุดนี้</h2>
                <p className="mt-1 text-sm text-muted">แสดงตัวอย่าง 6 ภารกิจแรก — ซื้อบอร์ดเพื่อดูทั้งหมด</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {MOCK_MISSIONS.map((mission, i) => (
                    <div
                      key={mission.id}
                      className="flex items-center gap-3 rounded-lg border border-forest-800/10 bg-white/70 p-4"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-800 text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-forest-900">{mission.name}</p>
                        <span className={cn(
                          'mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          DIFFICULTY_COLORS[mission.difficulty] ?? '',
                        )}>
                          {DIFFICULTY_LABELS[mission.difficulty] ?? mission.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards */}
            {activeTab === 'rewards' && (
              <div>
                <h2 className="font-serif text-xl font-bold text-forest-900">Pins ที่ได้รับ</h2>
                <p className="mt-1 text-sm text-muted">ทำภารกิจครบเพื่อปลดล็อก Pin สุดเอ็กซ์คลูซีฟ</p>
                <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
                  {REWARD_PINS.map((pin) => (
                    <div key={pin.id} className="flex flex-col items-center gap-2">
                      <div className={cn(
                        'flex h-16 w-16 items-center justify-center rounded-full border-2 text-2xl',
                        pin.name === '???' ? 'grayscale border-muted/30 bg-sand-100' : RARITY_COLORS[pin.rarity] ?? '',
                      )}>
                        <span aria-hidden="true">{pin.emoji}</span>
                      </div>
                      <p className="text-center text-[10px] font-medium text-forest-900 leading-tight">{pin.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's in the box */}
            {activeTab === 'whats-in-box' && (
              <div>
                <h2 className="font-serif text-xl font-bold text-forest-900">สิ่งที่อยู่ในกล่อง</h2>
                <p className="mt-1 text-sm text-muted">ทุกอย่างที่คุณได้รับเมื่อสั่งซื้อ</p>
                <ul className="mt-6 space-y-3">
                  {BOX_ITEMS.map((item) => (
                    <li key={item.name} className="flex items-start gap-4 rounded-xl border border-forest-800/10 bg-white/70 p-4">
                      <span className="flex-shrink-0 text-2xl" aria-hidden="true">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-forest-900">{item.name}</p>
                        <p className="text-sm text-muted">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar — same on all tabs */}
          <div className="rounded-2xl border border-forest-800/10 bg-white/70 p-6 shadow-card">
            <p className="text-2xl font-bold text-forest-900">{board.priceThb.toLocaleString('th-TH')} บาท</p>
            <ul className="mt-4 space-y-2 text-sm text-ink/80">
              <li>✓ บอร์ด A3 คุณภาพสูง</li>
              <li>✓ QR Activation Card</li>
              <li>✓ {board.questCount} ภารกิจดิจิตอล</li>
              <li>✓ Sticker Sheet</li>
              <li>✓ สิทธิ์ Claim Pin ทุกภารกิจ</li>
            </ul>
            <Button variant="gold" className="mt-6 w-full" asChild>
              <Link href="/shop">เพิ่มลงรถเข็น</Link>
            </Button>
            <Button variant="secondary" className="mt-2 w-full" asChild>
              <Link href="/activate">มี Activation Code แล้ว</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
