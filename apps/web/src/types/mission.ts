// DM-MISSION (SPEC-06)
export type MissionRegion = 'north' | 'central' | 'northeast' | 'east' | 'south';
export type MissionCategory = 'mountain' | 'waterfall' | 'marine' | 'forest';
export type MissionDifficulty = 'easy' | 'medium' | 'hard';

// FE-STATE (SPEC-08)
export type MissionStatus =
  | 'locked'
  | 'available'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'need_more_info'
  | 'rejected'
  | 'completed';

export type Mission = {
  id: string;
  boardTemplateId: string;
  name: string;
  description: string;
  parkName: string;
  parkCode: string;
  region: MissionRegion;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  latitude: number;
  longitude: number;
  coverImageUrl: string;
  rewardBadgeId: string;
  sortOrder: number;
  status: 'active' | 'archived';
};

// DM-SUBMISSION (SPEC-06)
export type MissionSubmission = {
  id: string;
  userBoardId: string;
  missionId: string;
  userId: string;
  photoUrls: string[];
  latitude: number | null;
  longitude: number | null;
  note: string | null;
  status: MissionStatus;
  reviewNote: string | null;
  submittedAt: string;
  reviewedAt: string | null;
};
