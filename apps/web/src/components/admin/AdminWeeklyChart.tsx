'use client';

// ADMIN-006 (TASK_ADMIN) — SVG sparkline weekly chart
// No external chart library required

type DataPoint = {
  label: string; // e.g. "24 พ.ค."
  orders: number;
  activations: number;
};

type AdminWeeklyChartProps = {
  data: DataPoint[];
};

const CHART_WIDTH = 600;
const CHART_HEIGHT = 200;
const PADDING = { top: 20, right: 20, bottom: 30, left: 44 };

function toSvgPoints(
  values: number[],
  maxVal: number,
  minVal: number,
): string {
  const w = CHART_WIDTH - PADDING.left - PADDING.right;
  const h = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const step = w / (values.length - 1);
  const range = maxVal - minVal || 1;

  return values
    .map((v, i) => {
      const x = PADDING.left + i * step;
      const y = PADDING.top + h - ((v - minVal) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
}

const Y_TICKS = [0, 100, 200, 300, 400, 500];

export function AdminWeeklyChart({ data }: AdminWeeklyChartProps) {
  const allValues = [...data.map((d) => d.orders), ...data.map((d) => d.activations)];
  const maxVal = Math.max(...allValues, 500);
  const minVal = 0;

  const ordersPoints = toSvgPoints(
    data.map((d) => d.orders),
    maxVal,
    minVal,
  );
  const activationsPoints = toSvgPoints(
    data.map((d) => d.activations),
    maxVal,
    minVal,
  );

  const w = CHART_WIDTH - PADDING.left - PADDING.right;
  const h = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const step = w / (data.length - 1);
  const range = maxVal - minVal || 1;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="แนวโน้มคำสั่งซื้อรายสัปดาห์"
      >
        {/* Y-axis grid lines + labels */}
        {Y_TICKS.map((tick) => {
          const y = PADDING.top + h - ((tick - minVal) / range) * h;
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={CHART_WIDTH - PADDING.right}
                y2={y}
                stroke="#12382E"
                strokeOpacity={0.06}
                strokeDasharray="4 3"
              />
              <text
                x={PADDING.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#6D746F"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={d.label}
            x={PADDING.left + i * step}
            y={CHART_HEIGHT - 6}
            textAnchor="middle"
            fontSize={10}
            fill="#6D746F"
          >
            {d.label}
          </text>
        ))}

        {/* Orders line (solid forest) */}
        <polyline
          points={ordersPoints}
          fill="none"
          stroke="#1E4D3E"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Activations line (dashed gold) */}
        <polyline
          points={activationsPoints}
          fill="none"
          stroke="#D6A84F"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="6 3"
        />

        {/* Data points for orders */}
        {data.map((d, i) => {
          const x = PADDING.left + i * step;
          const y = PADDING.top + h - ((d.orders - minVal) / range) * h;
          return (
            <circle key={`o-${i}`} cx={x} cy={y} r={3.5} fill="#1E4D3E" />
          );
        })}

        {/* Data points for activations */}
        {data.map((d, i) => {
          const x = PADDING.left + i * step;
          const y = PADDING.top + h - ((d.activations - minVal) / range) * h;
          return (
            <circle key={`a-${i}`} cx={x} cy={y} r={3} fill="#D6A84F" />
          );
        })}
      </svg>
    </div>
  );
}
