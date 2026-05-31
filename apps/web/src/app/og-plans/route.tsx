import { ImageResponse } from 'next/og';

// OG image — plans (TASK-024)
export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '64px',
          background: 'linear-gradient(180deg, #2a4d3c 0%, #132b1e 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ fontSize: 18, color: '#c9a96e', marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          TRAVEL PLANS
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, color: '#f5e6c8', lineHeight: 1.15, maxWidth: 850 }}>
          แผนการเดินทางจาก Explorer จริง ผ่านการพิสูจน์แล้ว
        </div>
        <div style={{ marginTop: 20, fontSize: 22, color: '#a0b89a' }}>
          Questory
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
