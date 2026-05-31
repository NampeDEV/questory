import { ImageResponse } from 'next/og';

// OG image — boards (TASK-024)
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
          background: 'linear-gradient(180deg, #1a3a2e 0%, #0f1e17 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ fontSize: 18, color: '#c9a96e', marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          BOARDS
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: '#f5e6c8', lineHeight: 1.1, maxWidth: 800 }}>
          เลือกบอร์ดที่ใช่ เริ่ม Quest ของคุณ
        </div>
        <div style={{ marginTop: 20, fontSize: 22, color: '#a0b89a' }}>
          Questory
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
