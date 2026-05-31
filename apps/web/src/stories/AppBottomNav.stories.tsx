import type { Meta, StoryObj } from '@storybook/react';
import { AppBottomNav } from '@/components/layout/AppBottomNav';

const meta: Meta<typeof AppBottomNav> = {
  title: 'Layout/AppBottomNav',
  component: AppBottomNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AppBottomNav>;

export const HomeActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/app',
      },
    },
  },
};

export const BoardsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/app/boards',
      },
    },
  },
};

export const MissionsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/app/missions',
      },
    },
  },
};

export const PinsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/app/pins',
      },
    },
  },
};

export const ProfileActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/app/profile',
      },
    },
  },
};
