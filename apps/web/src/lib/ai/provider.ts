/**
 * AI provider abstraction (SPEC-09 / AC-AI-001).
 * Driven by env: AI_PROVIDER=openai|mock (default: mock)
 * M4: add Azure OpenAI, Anthropic options.
 * @security Never log or pass PII through this layer.
 */

export type TripPlanRequest = {
  startLocation: string;
  destination: string;
  days: number;        // 1–7
  budgetThb: number;
  travelStyle: 'adventure' | 'relaxed' | 'cultural';
  people: number;      // 1–8
};

export type DayItinerary = {
  day: number;
  title: string;
  activities: Array<{
    time: string;
    description: string;
    estimatedCostThb: number;
  }>;
};

export type TripPlanResponse = {
  summary: string;
  days: DayItinerary[];
  totalEstimatedCostThb: number;
  tips: string[];
};

const MOCK_TRIP_PLAN: TripPlanResponse = {
  summary: 'การเดินทาง 3 วัน 2 คืน สู่อุทยานแห่งชาติดอยอินทนนท์',
  days: [
    {
      day: 1,
      title: 'เดินทาง + ตั้งแคมป์',
      activities: [
        { time: '06:00', description: 'ออกเดินทางจากเชียงใหม่', estimatedCostThb: 200 },
        { time: '09:00', description: 'ถึงอุทยานฯ — ลงทะเบียน', estimatedCostThb: 300 },
        { time: '11:00', description: 'เส้นทาง Kew Mae Pan Nature Trail', estimatedCostThb: 0 },
        { time: '18:00', description: 'ตั้งแคมป์ที่ลานจอดรถยอดดอย', estimatedCostThb: 150 },
      ],
    },
    {
      day: 2,
      title: 'ยอดดอยอินทนนท์ + น้ำตก',
      activities: [
        { time: '05:30', description: 'ชมพระอาทิตย์ขึ้นที่ยอดดอย 2,565 ม.', estimatedCostThb: 0 },
        { time: '09:00', description: 'น้ำตกแม่กลาง', estimatedCostThb: 0 },
        { time: '14:00', description: 'น้ำตกวชิรธาร', estimatedCostThb: 0 },
        { time: '18:00', description: 'อาหารเย็น หมูกระทะสวนดอก', estimatedCostThb: 350 },
      ],
    },
    {
      day: 3,
      title: 'เยี่ยมชุมชน + เดินทางกลับ',
      activities: [
        { time: '07:00', description: 'เยี่ยมหมู่บ้านชาวเขา', estimatedCostThb: 0 },
        { time: '10:00', description: 'ตลาดดอยปุย', estimatedCostThb: 200 },
        { time: '14:00', description: 'เดินทางกลับเชียงใหม่', estimatedCostThb: 200 },
      ],
    },
  ],
  totalEstimatedCostThb: 1400,
  tips: [
    'สภาพอากาศเย็นจัด เตรียมเสื้อหนาว',
    'จองที่พักล่วงหน้า โดยเฉพาะช่วงฤดูหนาว',
    'ซื้อน้ำและอาหารในเมืองก่อนขึ้นดอย',
  ],
};

type AIProvider = 'mock'; // | 'openai' — add in M4

function getProvider(): AIProvider {
  const raw = process.env['AI_PROVIDER'];
  if (raw === 'openai') {
    // TODO(#ai-m4): return 'openai' when real integration is ready
    console.warn('[AI] openai provider not yet implemented — falling back to mock');
  }
  return 'mock';
}

export async function generateTripPlan(
  request: TripPlanRequest,
): Promise<TripPlanResponse> {
  const provider = getProvider();

  if (provider === 'mock') {
    // Simulate network latency in development only
    if (process.env.NODE_ENV === 'development') {
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
    }
    return {
      ...MOCK_TRIP_PLAN,
      summary: `การเดินทาง ${request.days} วัน สู่ ${request.destination}`,
      days: MOCK_TRIP_PLAN.days.slice(0, request.days),
    };
  }

  // Unreachable until M4 — provider is always 'mock' for now
  throw new Error(`AI provider "${provider as string}" not implemented`);
}
