import type { Meta, StoryObj } from '@storybook/react';
import { BadgePill } from '@/components/ui/BadgePill';

// TASK-026: BadgePill stories
const meta: Meta<typeof BadgePill> = {
  title: 'UI/BadgePill',
  component: BadgePill,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof BadgePill>;

export const Default: Story = {
  args: { children: 'Starter' },
};

export const Rare: Story = {
  args: { variant: 'rare', children: '⭐ Rare' },
};

export const Epic: Story = {
  args: { variant: 'epic', children: '🔮 Epic' },
};

export const Legendary: Story = {
  args: { variant: 'legendary', children: '👑 Legendary' },
};

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <BadgePill>Starter</BadgePill>
      <BadgePill variant="rare">🗺️ Regional</BadgePill>
      <BadgePill variant="legendary">⭐ Ultimate</BadgePill>
    </div>
  ),
};
