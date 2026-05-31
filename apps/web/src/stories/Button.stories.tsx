import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/Button';

// TASK-026: Button stories
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'gold', 'ghost', 'danger'] },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary Button' },
};

export const Gold: Story = {
  args: { variant: 'gold', children: 'Start Your Quest' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Explore Boards' },
};

export const Loading: Story = {
  args: { variant: 'primary', isLoading: true, children: 'Loading...' },
};

export const Small: Story = {
  args: { variant: 'primary', size: 'sm', children: 'Small' },
};

export const Large: Story = {
  args: { variant: 'gold', size: 'lg', children: 'Large Gold' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' },
};
