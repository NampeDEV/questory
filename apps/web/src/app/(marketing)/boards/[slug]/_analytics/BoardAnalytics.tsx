'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/utils/analytics';

type BoardAnalyticsProps = {
  boardId: string;
  boardName: string;
};

/**
 * Client-only component that fires `board_view` once on mount.
 * Rendered inside the Server Component board detail page.
 */
export function BoardAnalytics({ boardId, boardName }: BoardAnalyticsProps) {
  useEffect(() => {
    analytics.boardView(boardId, boardName);
  }, [boardId, boardName]);

  return null;
}
