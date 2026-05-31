// DM-BADGE / DM-PIN (SPEC-06)
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: BadgeRarity;
  missionId: string | null;
  boardTemplateId: string | null;
};

export type UserBadge = {
  id: string;
  userId: string;
  badgeId: string;
  missionSubmissionId: string;
  unlockedAt: string;
};

// FE-STATE (SPEC-08)
export type PinStatus =
  | 'locked'
  | 'unlocked'
  | 'claim_available'
  | 'claimed'
  | 'shipped'
  | 'delivered';

export type Pin = {
  id: string;
  badgeId: string;
  name: string;
  imageUrl: string;
  type:
    | 'mission'
    | 'region'
    | 'category'
    | 'rare'
    | 'completion'
    | 'creator'
    | 'sponsored';
};

export type PinClaim = {
  id: string;
  userId: string;
  pinId: string;
  userBadgeId: string;
  status: PinStatus;
  shippingName: string;
  shippingAddress: string;
  trackingNumber: string | null;
  claimedAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
};
