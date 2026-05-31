import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

// OG image — default (TASK-024)
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
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a3a2e 0%, #0f2318 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: '#f5e6c8', letterSpacing: '-1px' }}>
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 16, fontSize: 28, color: '#d4b896', textAlign: 'center', maxWidth: 800 }}>
          {siteConfig.taglineEn}
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
          {['🏔️ 77 จังหวัด', '🗺️ Quest ทุกรูปแบบ', '📌 Collect Pins'].map((item) => (
            <div
              key={item}
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '10px 20px',
                color: '#f5e6c8',
                fontSize: 18,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
