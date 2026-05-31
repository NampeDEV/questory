import type { Meta, StoryObj } from '@storybook/react';
import { BadgePinCard } from '@/components/sections/BadgePinCard';

const meta: Meta<typeof BadgePinCard> = {
  title: 'Domain/BadgePinCard',
  component: BadgePinCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof BadgePinCard>;

export const Locked: Story = {
  args: {
    name: 'Summit Master',
    imageUrl: '/images/hero/hero-main.jpg',
    rarity: 'common',
    status: 'locked',
  },
};

export const Unlocked: Story = {
  args: {
    name: 'Summit Master',
    imageUrl: '/images/hero/hero-main.jpg',
    rarity: 'rare',
    status: 'unlocked',
  },
};

export const ClaimAvailable: Story = {
  args: {
    name: 'Forest Ranger',
    imageUrl: '/images/hero/hero-main.jpg',
    rarity: 'legendary',
    status: 'claim_available',
  },
};
