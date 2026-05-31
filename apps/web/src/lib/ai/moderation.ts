/**
 * Content moderation layer (SPEC-09 / AC-AI-003).
 * Thai keyword blocklist + provider-side moderation stub.
 * @security This is a defence-in-depth layer — never rely on it as the sole check.
 */

// Thai/English keywords that should block AI generation
// Sorted by category for auditability
const BLOCKLIST: readonly string[] = [
  // Dangerous locations
  'restricted zone',
  'เขตหวงห้าม',
  // Drones in no-fly zones
  'drone', 'โดรน', 'no-fly',
  // Harmful activities
  'cliff jump', 'กระโดดหน้าผา',
  // Legal violations
  'trespass', 'บุกรุก', 'poaching', 'ล่าสัตว์',
] as const;

export type ModerationResult =
  | { blocked: false }
  | { blocked: true; reason: string };

/**
 * Check user input before sending to the AI provider.
 * Returns `blocked: true` if any blocklist term is found.
 */
export function moderateInput(input: string): ModerationResult {
  const normalised = input.toLowerCase();
  for (const term of BLOCKLIST) {
    if (normalised.includes(term.toLowerCase())) {
      return {
        blocked: true,
        reason: 'คำขอของคุณมีเนื้อหาที่ไม่เหมาะสม กรุณาตรวจสอบและลองใหม่',
      };
    }
  }
  return { blocked: false };
}
