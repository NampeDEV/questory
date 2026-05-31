import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use — Questory',
  description: 'เงื่อนไขการใช้งาน Questory',
};

export default function TermsPage() {
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
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-muted">อัปเดตล่าสุด: 1 มิถุนายน 2567</p>

      <div className="mt-10 space-y-10 text-ink">

        <section>
          <h2 className="text-xl font-semibold text-forest-900">1. การยอมรับเงื่อนไข</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            การใช้งาน Questory (&ldquo;แพลตฟอร์ม&rdquo;) ถือว่าคุณยอมรับเงื่อนไขการใช้งานฉบับนี้
            หากไม่ยอมรับ กรุณาหยุดใช้งานแพลตฟอร์ม
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">2. บริการที่ให้</h2>
          <div className="mt-4 text-sm leading-relaxed text-muted space-y-3">
            <p>Questory ให้บริการ:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>แพลตฟอร์มภารกิจท่องเที่ยวอุทยานแห่งชาติไทย</li>
              <li>Board ภารกิจ (Board) สำหรับสะสมความทรงจำและ Badge</li>
              <li>ระบบจัดส่ง Pin ของสะสมทางกายภาพ</li>
              <li>เครื่องมือ AI สำหรับวางแผนการเดินทาง</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">3. บัญชีผู้ใช้</h2>
          <div className="mt-4 text-sm leading-relaxed text-muted space-y-3">
            <ul className="list-disc space-y-1.5 pl-6">
              <li>คุณต้องมีอายุ 13 ปีขึ้นไปในการสร้างบัญชี</li>
              <li>คุณรับผิดชอบต่อความปลอดภัยของรหัสผ่าน</li>
              <li>ห้ามสร้างบัญชีในนามของผู้อื่นโดยไม่ได้รับอนุญาต</li>
              <li>เราขอสงวนสิทธิ์ระงับบัญชีที่ละเมิดเงื่อนไข</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">4. การซื้อและ Activation Code</h2>
          <div className="mt-4 text-sm leading-relaxed text-muted space-y-3">
            <ul className="list-disc space-y-1.5 pl-6">
              <li>Activation Code ใช้ได้ครั้งเดียวต่อบัญชีเท่านั้น</li>
              <li>Code ที่ซื้อแล้วไม่สามารถขอคืนเงินได้ ยกเว้นกรณีสินค้ามีข้อบกพร่อง</li>
              <li>Pin ทางกายภาพจัดส่งภายใน 7-14 วันทำการหลังจากได้รับการยืนยัน</li>
              <li>ราคาสินค้าอาจเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า แต่จะไม่กระทบคำสั่งซื้อที่ดำเนินการแล้ว</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">5. เนื้อหาที่ผู้ใช้สร้าง</h2>
          <div className="mt-4 text-sm leading-relaxed text-muted space-y-3">
            <p>เมื่ออัปโหลดรูปภาพหรือเนื้อหา คุณยืนยันว่า:</p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>คุณเป็นเจ้าของหรือมีสิทธิ์ในเนื้อหานั้น</li>
              <li>เนื้อหาไม่ละเมิดกฎหมาย ลิขสิทธิ์ หรือสิทธิ์ของผู้อื่น</li>
              <li>ไม่มีเนื้อหาที่ไม่เหมาะสม รุนแรง หรือสร้างความเกลียดชัง</li>
            </ul>
            <p>
              คุณให้สิทธิ์แก่ Questory ในการแสดงเนื้อหาบนแพลตฟอร์มและสื่อการตลาด
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">6. ความปลอดภัยในการท่องเที่ยว</h2>
          <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm leading-relaxed text-muted">
            <p className="font-semibold text-ink">ประกาศสำคัญด้านความปลอดภัย</p>
            <p className="mt-2">
              ส่งหลักฐานจากจุดที่ปลอดภัยเท่านั้น ความปลอดภัยสำคัญกว่า Badge
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>ปฏิบัติตามกฎของอุทยานแห่งชาติอย่างเคร่งครัด</li>
              <li>ห้ามทำภารกิจในพื้นที่หวงห้ามหรืออันตราย</li>
              <li>แพลตฟอร์มไม่รับผิดชอบต่ออุบัติเหตุที่เกิดจากการทำภารกิจ</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">7. การจำกัดความรับผิด</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            แพลตฟอร์มให้บริการ &ldquo;ตามสภาพที่เป็น&rdquo; (AS IS) เราไม่รับประกันว่าบริการจะไม่มีข้อผิดพลาด
            หรือพร้อมใช้งานตลอดเวลา ความรับผิดของเราจำกัดอยู่ที่มูลค่าที่คุณชำระสำหรับบริการนั้น ๆ
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">8. กฎหมายที่ใช้บังคับ</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            เงื่อนไขการใช้งานนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใด ๆ จะได้รับการพิจารณาโดยศาลที่มีเขตอำนาจ
            ในกรุงเทพมหานคร
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">9. การเปลี่ยนแปลงเงื่อนไข</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            เราขอสงวนสิทธิ์เปลี่ยนแปลงเงื่อนไขเหล่านี้ได้ทุกเวลา การแจ้งเตือนจะส่งผ่านอีเมลหรือ
            แสดงบนแพลตฟอร์ม การใช้งานต่อเนื่องหลังจากประกาศถือว่ายอมรับเงื่อนไขใหม่
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-forest-900">10. ติดต่อเรา</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            หากมีคำถามเกี่ยวกับเงื่อนไขการใช้งาน กรุณาติดต่อ:{' '}
            <a href="mailto:hello@questory.app" className="text-forest-700 hover:underline">
              hello@questory.app
            </a>
          </p>
        </section>

      </div>

      <div className="mt-12 border-t border-forest-800/10 pt-8">
        <Link
          href="/privacy"
          className="text-sm text-forest-700 hover:underline"
        >
          อ่าน Privacy Policy →
        </Link>
      </div>
    </div>
  );
}
