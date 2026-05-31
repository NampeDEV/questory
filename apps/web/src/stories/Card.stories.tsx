import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/ui/Card';

// TASK-026: Card stories
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <p className="text-sm text-ink p-4">Card content goes here</p>,
  },
};

export const WithHover: Story = {
  args: {
    hasHover: true,
    children: <p className="text-sm text-ink p-4">Hover me for lift effect</p>,
  },
};
