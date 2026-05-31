import type { Meta, StoryObj } from '@storybook/react';
import { Users } from 'lucide-react';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';

const meta: Meta<typeof AdminStatsCard> = {
  title: 'Admin/AdminStatsCard',
  component: AdminStatsCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof AdminStatsCard>;

export const UpTrend: Story = {
  args: {
    label: 'New Signups',
    value: '356',
    trend: '+12.4% จากสัปดาห์ก่อน',
    trendDirection: 'up',
    icon: <Users size={18} />,
  },
};

export const DownTrend: Story = {
  args: {
    label: 'Pending Submissions',
    value: '18',
    trend: '-8.2% จากสัปดาห์ก่อน',
    trendDirection: 'down',
    icon: <Users size={18} />,
  },
};

export const Neutral: Story = {
  args: {
    label: 'Pin Claims to Ship',
    value: '24',
    trend: 'คงที่',
    trendDirection: 'neutral',
    icon: <Users size={18} />,
  },
};
