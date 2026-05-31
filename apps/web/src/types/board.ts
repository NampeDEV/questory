// DM-BOARD-TEMPLATE (SPEC-06)
export type BoardCategory = 'starter' | 'regional' | 'ultimate' | 'custom';
export type BoardStatus = 'draft' | 'active' | 'archived';

export type BoardTemplate = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: BoardCategory;
  questCount: number;
  coverImageUrl: string;
  priceThb: number;
  status: BoardStatus;
  createdAt: string;
};

// DM-USER-BOARD (SPEC-06)
export type UserBoardStatus = 'active' | 'completed' | 'archived';

export type UserBoard = {
  id: string;
  userId: string;
  boardTemplateId: string;
  activationCode: string;
  activatedAt: string;
  progressCompleted: number;
  progressTotal: number;
  status: UserBoardStatus;
};
