import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Offline fallback page (AC-APP-010)
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-parchment px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest-800/10">
        <WifiOff size={36} className="text-forest-700" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-900">
          ไม่มีการเชื่อมต่ออินเทอร์เน็ต
        </h1>
        <p className="mt-2 text-muted">
          โปรดตรวจสอบการเชื่อมต่อของคุณแล้วลองอีกครั้ง
        </p>
      </div>
      <Button variant="secondary" asChild>
        <Link href="/">กลับหน้าแรก</Link>
      </Button>
    </div>
  );
}
