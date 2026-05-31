import type { Meta, StoryObj } from '@storybook/react';
import { MemoryCard } from '@/components/sections/MemoryCard';

const meta: Meta<typeof MemoryCard> = {
  title: 'Domain/MemoryCard',
  component: MemoryCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof MemoryCard>;

export const WithPhoto: Story = {
  args: {
    title: 'หมอกเช้าเหนือดอย',
    body: 'ตื่นเช้าเพื่อดูทะเลหมอกบนยอดดอย เป็นความทรงจำที่ประทับใจมาก',
    photoUrl: '/images/hero/hero-main.jpg',
    parkName: 'ดอยอินทนนท์',
    date: '28 พ.ค. 2569',
    badgeLabel: 'Epic',
  },
};

export const WithoutPhoto: Story = {
  args: {
    title: 'เดินป่าครั้งแรก',
    body: 'เส้นทางไม่ยากมาก เหมาะกับมือใหม่ มีจุดพักตลอดทาง',
    parkName: 'เขาใหญ่',
    date: '10 เม.ย. 2569',
  },
};

export const Minimal: Story = {
  args: {
    title: 'Memory Note',
    body: 'วันนี้อากาศดีมาก',
  },
};
