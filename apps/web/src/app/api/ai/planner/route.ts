import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateTripPlan } from '@/lib/ai/provider';
import { moderateInput } from '@/lib/ai/moderation';

const TravelStyles = ['adventure', 'relaxed', 'cultural'] as const;

const PlanRequestSchema = z.object({
  startLocation: z.string().min(1).max(100),
  destination: z.string().min(1).max(100),
  days: z.number().int().min(1).max(7),
  budgetThb: z.number().int().min(500).max(500_000),
  travelStyle: z.enum(TravelStyles),
  people: z.number().int().min(1).max(8),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
  }

  const parsed = PlanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Security: content moderation pre-check (AC-AI-003)
  const destinationCheck = moderateInput(parsed.data.destination);
  if (destinationCheck.blocked) {
    return NextResponse.json(
      { error: 'CONTENT_BLOCKED', message: destinationCheck.reason },
      { status: 422 },
    );
  }

  const startCheck = moderateInput(parsed.data.startLocation);
  if (startCheck.blocked) {
    return NextResponse.json(
      { error: 'CONTENT_BLOCKED', message: startCheck.reason },
      { status: 422 },
    );
  }

  try {
    const plan = await generateTripPlan(parsed.data);
    return NextResponse.json(plan, { status: 200 });
  } catch (err) {
    // Log server-side without exposing details to client
    console.error('[AI Planner] generateTripPlan failed:', err);
    return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 503 });
  }
}
