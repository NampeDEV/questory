import type { Meta, StoryObj } from '@storybook/react';
import { SiteHeader } from '@/components/layout/SiteHeader';

const meta: Meta<typeof SiteHeader> = {
  title: 'Layout/SiteHeader',
  component: SiteHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {};

export const OnBoardsPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/boards',
      },
    },
  },
};

export const OnHomePage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/',
      },
    },
  },
};
