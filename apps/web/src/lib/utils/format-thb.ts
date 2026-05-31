/**
 * Format Thai Baht currency.
 * Example: formatThb(1490) → "1,490 ฿"
 */
export function formatThb(amount: number): string {
  return `${amount.toLocaleString('th-TH')} ฿`;
}
