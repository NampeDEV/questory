import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '@/components/ui/ProgressBar';

// TASK-026: ProgressBar stories
const meta: Meta<typeof ProgressBar> = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const InProgress: Story = {
  args: { value: 5, max: 10, label: '5 / 10 ภารกิจ' },
};

export const Complete: Story = {
  args: { value: 10, max: 10, label: '10 / 10 ภารกิจ', isCompleted: true },
};

export const Empty: Story = {
  args: { value: 0, max: 10, label: '0 / 10 ภารกิจ' },
};

export const Large: Story = {
  args: { value: 7, max: 15, size: 'lg', label: '7 / 15 ภารกิจ' },
};
