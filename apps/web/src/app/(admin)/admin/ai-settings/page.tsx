import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = { title: 'AI Settings — Questory Admin' };

export default function AISettingsPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="AI Settings"
        description="ตั้งค่า AI Planner โมเดล และ Moderation Rules"
      />

      {/* Model Selection */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold text-ink">AI Model</h2>
        <div className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3">
            {[
              { id: 'claude-sonnet', label: 'Claude Sonnet 4.5 (แนะนำ)', selected: true },
              { id: 'claude-haiku', label: 'Claude Haiku 3.5 (เร็ว / ถูก)', selected: false },
              { id: 'gpt-4o', label: 'GPT-4o (OpenAI)', selected: false },
            ].map((m) => (
              <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${m.selected ? 'border-forest-700 bg-forest-700/5' : 'border-forest-800/10 hover:border-forest-700/40'}`}>
                <div className={`h-4 w-4 rounded-full border-2 ${m.selected ? 'border-forest-700 bg-forest-700' : 'border-sand-300'}`} />
                <span className="text-sm font-medium text-ink">{m.label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* System Prompt */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-ink">System Prompt</h2>
        <div className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <textarea
            readOnly
            rows={8}
            className="w-full resize-none rounded-lg border border-forest-800/10 bg-sand-100/40 p-3 font-mono text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/30"
            defaultValue={`You are Questory AI Planner, a travel guide assistant for Thai National Parks.\nHelp users plan exciting quests and activities at national parks across Thailand.\nAlways respond in Thai unless the user writes in English.\nFocus on eco-friendly, adventure-based recommendations.\nNever suggest illegal activities or harming wildlife.`}
          />
        </div>
      </section>

      {/* Moderation */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-ink">Moderation Rules</h2>
        <div className="rounded-2xl border border-forest-800/10 bg-white shadow-sm divide-y divide-forest-800/6">
          {[
            { label: 'กรองคำไม่เหมาะสม', enabled: true },
            { label: 'ตรวจสอบ Prompt Injection', enabled: true },
            { label: 'จำกัด Token ต่อ Request', enabled: true },
            { label: 'Log ทุก AI Request', enabled: false },
          ].map((rule) => (
            <div key={rule.label} className="flex items-center justify-between px-5 py-4">
              <p className="text-sm font-medium text-ink">{rule.label}</p>
              <div className={`relative h-6 w-11 rounded-full transition-colors ${rule.enabled ? 'bg-forest-700' : 'bg-sand-300'}`}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${rule.enabled ? 'left-6' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-end">
        <button type="button" className="rounded-xl bg-forest-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-900 transition-colors">
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}
