// DM-PLAN (SPEC-06)
export type PlanDifficulty = 'easy' | 'moderate' | 'challenging';

export type PlanDay = {
  day: number;
  title: string;
  activities: string[];
  parkName?: string;
  tips?: string;
};

export type Plan = {
  id: string;
  slug: string;
  title: string;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  coverImageUrl: string;
  durationDays: number;
  budgetThb: number;
  difficulty: PlanDifficulty;
  region: string;
  tags: string[];
  days: PlanDay[];
  copiedByCount: number;
  createdAt: string;
};
