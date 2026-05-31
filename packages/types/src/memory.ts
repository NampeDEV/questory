// DM-MEMORY (SPEC-06)
export type MemoryVisibility = 'public' | 'private';

export type Memory = {
  id: string;
  userId: string;
  missionSubmissionId: string;
  title: string;
  body: string;
  photoUrls: string[];
  visibility: MemoryVisibility;
  createdAt: string;
};
