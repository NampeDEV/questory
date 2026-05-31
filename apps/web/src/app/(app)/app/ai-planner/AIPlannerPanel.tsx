'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// AI Planner panel \u2014 client component (SPEC-09)
type AIState = 'idle' | 'loading' | 'done' | 'error';

export function AIPlannerPanel() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [aiState, setAiState] = useState<AIState>('idle');

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setAiState('loading');
    setResult('');
    // POC stub: real implementation calls POST /api/ai-planner
    await new Promise<void>((r) => setTimeout(r, 1500));
    setResult(
      `แผนการเดินทาง (POC)\n\nวันที่ 1: เดินทางไปอุทยาน → เช็คอิน\nวันที่ 2: ทำภารกิจ Mission A + Mission B\nวันที่ 3: เยี่ยมชมจุดไฮไลท์ → เดินทางกลับ\n\n[ผลลัพธ์จริงจะมาจาก OpenAI/Anthropic API]`,
    );
    setAiState('done');
  }

  return (
    <>
      {/* Input panel */}
      <section className="rounded-2xl border border-forest-800/10 bg-parchment p-6 shadow-card">
        <h2 className="text-sm font-semibold text-forest-900">บอก AI ว่าอยากไปไหน</h2>
        <form onSubmit={handleGenerate} className="mt-4 space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            maxLength={500}
            placeholder="เช่น: อยากไปเหนือ 3 วัน ชอบน้ำตก ไม่อยากขับรถไกล..."
            className="w-full rounded-lg border border-forest-700/30 bg-white px-4 py-3 text-sm text-ink focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          />
          <p className="text-right text-xs text-muted">{prompt.length}/500</p>
          <Button
            type="submit"
            variant="gold"
            className="w-full"
            isLoading={aiState === 'loading'}
            disabled={!prompt.trim() || aiState === 'loading'}
          >
            <Sparkles size={16} className="mr-2" aria-hidden="true" />
            สร้างแผน
          </Button>
        </form>
      </section>

      {/* Output panel */}
      <section className="rounded-2xl border border-forest-800/10 bg-white p-6 shadow-card">
        <h2 className="text-sm font-semibold text-forest-900">แผนที่ AI แนะนำ</h2>
        {aiState === 'idle' && (
          <p className="mt-4 text-sm text-muted">กรอกข้อมูลด้านซ้ายแล้วกดสร้างแผน</p>
        )}
        {aiState === 'loading' && (
          <div className="mt-6 flex items-center gap-3 text-muted">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">กำลังสร้างแผน...</span>
          </div>
        )}
        {aiState === 'error' && (
          <p className="mt-4 text-sm text-danger">เกิดข้อผิดพลาด กรุณาลองใหม่</p>
        )}
        {aiState === 'done' && result && (
          <pre className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink">{result}</pre>
        )}
      </section>
    </>
  );
}
