// Analytics — TASK-027 (SPEC-09 · S-043)
// PostHog is initialised in src/lib/providers/PostHogProvider.tsx.
// This module provides a typed, PII-safe wrapper around posthog-js.

import posthog from 'posthog-js';

type TrackEvent =
  | 'landing_view'
  | 'start_quest_click'
  | 'board_view'
  | 'add_to_cart'
  | 'mission_submit'
  | 'pin_claim';

type TrackProperties = Record<string, string | number | boolean | null | undefined>;

/**
 * Track an analytics event.
 * @security Never log PII, passwords, or payment data.
 */
export function track(event: TrackEvent, properties?: TrackProperties): void {
  // Security: strip any accidental PII keys before capturing
  const BLOCKED_KEYS = ['email', 'phone', 'password', 'token', 'card'] as const;
  const safeProps = properties
    ? Object.fromEntries(
        Object.entries(properties).filter(([key]) =>
          !BLOCKED_KEYS.some((blocked) => key.toLowerCase().includes(blocked)),
        ),
      )
    : undefined;

  if (process.env.NODE_ENV !== 'production') {
    console.info('[Analytics]', event, safeProps ?? {});
  }

  posthog.capture(event, safeProps);
}

// Pre-wired event helpers
export const analytics = {
  landingView:     () => track('landing_view'),
  startQuestClick: (source: string) => track('start_quest_click', { source }),
  boardView:       (boardId: string, boardName: string) => track('board_view', { boardId, boardName }),
  addToCart:       (product: string, quantity: number) => track('add_to_cart', { product, quantity }),
} as const;
