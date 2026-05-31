/**
 * Email HTML templates for transactional emails.
 * S-032 — order confirmation + activation code delivery.
 * @security Never include tokens, passwords, or payment data in email HTML.
 */

export type OrderConfirmationData = {
  orderId: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; priceThb: number }>;
  totalThb: number;
  activationCodes: string[];
  shippingAddress: string;
  siteUrl: string;
};

/**
 * Returns an HTML string for the order confirmation email.
 * Plain-HTML only — no React Email dependency required.
 */
export function orderConfirmationHtml(data: OrderConfirmationData): string {
  const { orderId, customerName, items, totalThb, activationCodes, shippingAddress, siteUrl } =
    data;

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e0d0;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e0d0;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e0d0;text-align:right;">฿${item.priceThb.toLocaleString('th-TH')}</td>
        </tr>`,
    )
    .join('');

  const codeBlocks =
    activationCodes.length > 0
      ? activationCodes
          .map(
            (code) =>
              `<div style="display:inline-block;background:#2d4a2d;color:#f5e6b8;font-family:monospace;
               font-size:18px;letter-spacing:4px;padding:12px 24px;border-radius:8px;margin:4px;">
                ${escapeHtml(code)}
              </div>`,
          )
          .join('')
      : '<p style="color:#888;">ไม่มี Activation Code สำหรับออร์เดอร์นี้</p>';

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ยืนยันคำสั่งซื้อ — Questory</title>
</head>
<body style="margin:0;padding:0;background:#f5efe0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a2e1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe0;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#2d4a2d;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#f5e6b8;font-size:24px;font-weight:700;letter-spacing:1px;">
                Questory
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;">สวัสดีคุณ <strong>${escapeHtml(customerName)}</strong></p>
              <p style="margin:0 0 24px;color:#555;line-height:1.6;">
                ขอบคุณที่สั่งซื้อสินค้ากับ Questory ออร์เดอร์ของคุณได้รับการยืนยันแล้ว
              </p>

              <!-- Order ID -->
              <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">หมายเลขออร์เดอร์</p>
              <p style="margin:0 0 24px;font-size:14px;font-family:monospace;background:#f5efe0;padding:8px 12px;border-radius:6px;display:inline-block;">
                ${escapeHtml(orderId)}
              </p>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e0d0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background:#f5efe0;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">สินค้า</th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">จำนวน</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">ราคา</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                  <tr style="background:#f5efe0;">
                    <td colspan="2" style="padding:10px 12px;text-align:right;font-weight:700;">รวมทั้งหมด</td>
                    <td style="padding:10px 12px;text-align:right;font-weight:700;color:#2d4a2d;">฿${totalThb.toLocaleString('th-TH')}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Activation Codes -->
              ${
                activationCodes.length > 0
                  ? `<div style="background:#f0f7f0;border:1px solid #c8dfc8;border-radius:8px;padding:20px;margin-bottom:24px;text-align:center;">
                <p style="margin:0 0 12px;font-weight:700;color:#2d4a2d;">🎯 Activation Code ของคุณ</p>
                <p style="margin:0 0 16px;font-size:13px;color:#555;">ใช้รหัสนี้เพื่อเปิดใช้งาน Board ของคุณที่ <strong>${escapeHtml(siteUrl)}/activate</strong></p>
                ${codeBlocks}
              </div>`
                  : ''
              }

              <!-- Shipping -->
              <div style="background:#f5efe0;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">ที่อยู่จัดส่ง</p>
                <p style="margin:0;font-size:14px;line-height:1.6;">${escapeHtml(shippingAddress)}</p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${escapeHtml(siteUrl)}/app" style="display:inline-block;background:#2d4a2d;color:#f5e6b8;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">
                  เริ่มต้น Quest ของคุณ →
                </a>
              </div>

              <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                หากมีข้อสงสัยกรุณาติดต่อ
                <a href="mailto:support@questory.app" style="color:#2d4a2d;">support@questory.app</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5efe0;padding:20px;text-align:center;border-top:1px solid #e8e0d0;">
              <p style="margin:0;font-size:12px;color:#aaa;">
                Questory · Thailand<br />
                <a href="${escapeHtml(siteUrl)}/privacy" style="color:#aaa;">นโยบายความเป็นส่วนตัว</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Escape HTML special characters to prevent XSS in email content. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
