import type { Meta, StoryObj } from '@storybook/react';
import { ProgressCard } from '@/components/ui/ProgressCard';

const meta: Meta<typeof ProgressCard> = {
  title: 'Domain/ProgressCard',
  component: ProgressCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ProgressCard>;

export const Empty: Story = {
  args: {
    title: 'Northern Park Quest',
    completed: 0,
    total: 20,
    label: 'Parks',
  },
};

export const Midway: Story = {
  args: {
    title: 'Northern Park Quest',
    completed: 10,
    total: 20,
    label: 'Parks',
  },
};

export const Completed: Story = {
  args: {
    title: 'Northern Park Quest',
    completed: 20,
    total: 20,
    label: 'Parks',
  },
};
