import type { Meta, StoryObj } from '@storybook/react';
import { QuestCard } from '@/components/sections/QuestCard';

const meta: Meta<typeof QuestCard> = {
  title: 'Domain/QuestCard',
  component: QuestCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof QuestCard>;

const baseArgs = {
  id: 'mission-001',
  slug: 'doi-inthanon-summit',
  name: 'พิชิตยอดดอยอินทนนท์ยามเช้า',
  coverImageUrl: '/images/hero/hero-main.jpg',
  parkName: 'อุทยานแห่งชาติดอยอินทนนท์',
  category: 'mountain' as const,
  copiedCount: 412,
};

export const Easy: Story = {
  args: {
    ...baseArgs,
    difficulty: 'easy',
  },
};

export const Medium: Story = {
  args: {
    ...baseArgs,
    difficulty: 'medium',
    name: 'ล่าทะเลหมอกเส้นทางปานกลาง',
  },
};

export const Hard: Story = {
  args: {
    ...baseArgs,
    difficulty: 'hard',
    name: 'เทรคระยะไกลพิชิตยอดเขา',
  },
};
