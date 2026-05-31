import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Questory',
  description: 'นโยบายความเป็นส่วนตัวของ Questory',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-12 sm:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-muted hover:text-ink transition-colors"
        >
          ← กลับหน้าหลัก
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold text-forest-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">อัปเดตล่าสุด: 1 มิถุนายน 2567</p>

      <div className="mt-10 space-y-10 text-ink">

        <section>
          <h2 className="text-xl font-semibold text-forest-900">1. ข้อมูลที่เราเก็บรวบรวม</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              เราเก็บรวบรวมข้อมูลที่จำเป็นเพื่อให้บริการ Questory ซึ่งประกอบด้วย:
            </p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>ข้อมูลบัญชี: ชื่อ อีเมล รูปโปรไฟล์ (จาก Google OAuth หรือลงทะเบียนเอง)</li>
              <li>ข้อมูลการใช้งาน: ความคืบหน้าภารกิจ การส่งหลักฐาน และประวัติการรับ Badge</li>
              <li>ข้อมูลคำสั่งซื้อ: รายการสินค้า ที่อยู่จัดส่ง สำหรับการจัดส่ง Pin</li>
              <li>ข้อมูลตำแหน่ง: พิกัด GPS ที่แนบมากับหลักฐานภารกิจ (เฉพาะเมื่อผู้ใช้อนุญาต)</li>
              <li>รูปภาพ: ภาพถ่ายที่อัปโหลดเพื่อส่งหลักฐานภารกิจ</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">2. วัตถุประสงค์การใช้ข้อมูล</h2>
          <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            <p>เราใช้ข้อมูลที่เก็บรวบรวมเพื่อ:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>ให้บริการและปรับปรุงแพลตฟอร์ม Questory</li>
              <li>ยืนยันตัวตนและรักษาความปลอดภัยของบัญชี</li>
              <li>ประมวลผลคำสั่งซื้อและจัดส่ง Pin/Badge</li>
              <li>ส่งการแจ้งเตือนเกี่ยวกับสถานะภารกิจและรางวัล</li>
              <li>วิเคราะห์การใช้งานเพื่อปรับปรุงประสบการณ์ผู้ใช้</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">3. การแบ่งปันข้อมูล</h2>
          <div className="mt-4 text-sm leading-relaxed text-muted space-y-3">
            <p>
              เราไม่ขายข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สาม เราอาจแบ่งปันข้อมูลเฉพาะในกรณีต่อไปนี้:
            </p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>ผู้ให้บริการที่เชื่อถือได้ (Supabase, Vercel, Omise) เพื่อดำเนินการระบบ</li>
              <li>เมื่อจำเป็นต้องปฏิบัติตามกฎหมายหรือคำสั่งศาล</li>
              <li>กรณีมีการรวมกิจการ โดยจะแจ้งให้ทราบล่วงหน้า</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">4. ความปลอดภัยของข้อมูล</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสม ได้แก่ การเข้ารหัส HTTPS การป้องกัน
            ด้วย Row-Level Security ใน Supabase และการตรวจสอบสิทธิ์เข้าถึงข้อมูลทุกระดับ
            อย่างไรก็ตาม ไม่มีระบบใดที่ปลอดภัย 100% เราจึงแนะนำให้ผู้ใช้ตั้งรหัสผ่านที่แข็งแกร่ง
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">5. สิทธิ์ของผู้ใช้</h2>
          <div className="mt-4 text-sm leading-relaxed text-muted space-y-3">
            <p>คุณมีสิทธิ์ดังต่อไปนี้เกี่ยวกับข้อมูลส่วนบุคคลของคุณ:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>เข้าถึงและดูข้อมูลที่เราเก็บรวบรวม</li>
              <li>แก้ไขข้อมูลที่ไม่ถูกต้อง</li>
              <li>ลบบัญชีและข้อมูลทั้งหมด (ติดต่อเราทางอีเมล)</li>
              <li>ขอสำเนาข้อมูลในรูปแบบที่อ่านได้</li>
            </ul>
            <p>หากต้องการใช้สิทธิ์เหล่านี้ กรุณาติดต่อ{' '}
              <a
                href="mailto:privacy@questory.app"
                className="text-forest-700 hover:underline"
              >
                privacy@questory.app
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">6. การเก็บรักษาข้อมูล</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            เราเก็บรักษาข้อมูลบัญชีตราบเท่าที่คุณยังใช้งานแพลตฟอร์ม หลังจากลบบัญชีแล้ว
            ข้อมูลจะถูกลบภายใน 30 วัน ยกเว้นข้อมูลที่จำเป็นต้องเก็บตามกฎหมาย (เช่น ข้อมูลการทำธุรกรรม)
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">7. คุกกี้และ Analytics</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            เราใช้ PostHog สำหรับ analytics โดยไม่ระบุตัวตน เพื่อทำความเข้าใจพฤติกรรมการใช้งาน
            และปรับปรุงแพลตฟอร์ม คุณสามารถปิดการติดตามได้ในการตั้งค่าบราวเซอร์
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">8. ติดต่อเรา</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อ:{' '}
            <a href="mailto:privacy@questory.app" className="text-forest-700 hover:underline">
              privacy@questory.app
            </a>
          </p>
        </section>

      </div>

      <div className="mt-12 border-t border-forest-800/10 pt-8">
        <Link
          href="/terms"
          className="text-sm text-forest-700 hover:underline"
        >
          อ่าน Terms of Use →
        </Link>
      </div>
    </div>
  );
}
