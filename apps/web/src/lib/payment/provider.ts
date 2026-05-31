/**
 * Payment provider abstraction — S-030 (SPEC-10 / PROJECT_OVERVIEW § 7).
 * Switch via env: PAYMENT_PROVIDER=omise|mock (default: mock)
 * Omise supports PromptPay QR and credit cards for Thai market.
 * @security Never log full card numbers, CVVs, or full bank account numbers.
 */

export type PaymentMethod = 'promptpay' | 'credit_card' | 'bank_transfer';

export type CreateChargeRequest = {
  /** Amount in THB satang (1 THB = 100 satang) */
  amountSatang: number;
  currency: 'THB';
  method: PaymentMethod;
  /** Omise source token (from omise.js client-side tokenization) */
  sourceToken: string;
  metadata: {
    orderId: string;
    userId: string;
  };
};

export type ChargeStatus = 'pending' | 'successful' | 'failed' | 'reversed';

export type CreateChargeResult = {
  chargeId: string;
  status: ChargeStatus;
  /** PromptPay QR code SVG or PNG data URL — only present for promptpay method */
  qrCodeUrl?: string;
  /** Deep link for mobile banking apps — only present for promptpay method */
  authorizeUri?: string;
  /** ISO timestamp of charge expiry — only present for promptpay */
  expiresAt?: string;
};

export type GetChargeResult = {
  chargeId: string;
  status: ChargeStatus;
  amountSatang: number;
  paidAt?: string;
};

export interface PaymentProvider {
  createCharge(req: CreateChargeRequest): Promise<CreateChargeResult>;
  getCharge(chargeId: string): Promise<GetChargeResult>;
}

/** Mock provider — used when PAYMENT_PROVIDER=mock or no Omise keys are set */
class MockPaymentProvider implements PaymentProvider {
  async createCharge(req: CreateChargeRequest): Promise<CreateChargeResult> {
    const chargeId = `ch_mock_${Date.now()}`;
    console.info('[payment/mock] createCharge', { chargeId, orderId: req.metadata.orderId });
    return {
      chargeId,
      status: 'pending',
      qrCodeUrl: `https://placehold.co/300x300/2d4a2d/f5e6b8?text=PromptPay+QR+(Mock)`,
      authorizeUri: undefined,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  async getCharge(chargeId: string): Promise<GetChargeResult> {
    return { chargeId, status: 'successful', amountSatang: 0 };
  }
}

/** Omise provider — used when PAYMENT_PROVIDER=omise and OMISE_SECRET_KEY is set */
class OmisePaymentProvider implements PaymentProvider {
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.omise.co';

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private get authHeader(): string {
    // Basic auth: base64(secretKey:)
    const credentials = Buffer.from(`${this.secretKey}:`).toString('base64');
    return `Basic ${credentials}`;
  }

  async createCharge(req: CreateChargeRequest): Promise<CreateChargeResult> {
    const body = new URLSearchParams({
      amount: req.amountSatang.toString(),
      currency: req.currency,
      source: req.sourceToken,
      'metadata[order_id]': req.metadata.orderId,
      'metadata[user_id]': req.metadata.userId,
    });

    const response = await fetch(`${this.baseUrl}/charges`, {
      method: 'POST',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Log error code only — never log full response which may contain sensitive data
      console.error('[payment/omise] createCharge failed', {
        status: response.status,
        orderId: req.metadata.orderId,
      });
      throw new Error(`Omise charge creation failed: ${response.status} — ${errorText.substring(0, 100)}`);
    }

    type OmiseCharge = {
      id: string;
      status: string;
      source?: { scannable_code?: { image?: { download_uri?: string } }; authorize_uri?: string };
      expires_at?: string;
    };
    const charge = (await response.json()) as OmiseCharge;

    return {
      chargeId: charge.id,
      status: mapOmiseStatus(charge.status),
      qrCodeUrl: charge.source?.scannable_code?.image?.download_uri,
      authorizeUri: charge.source?.authorize_uri,
      expiresAt: charge.expires_at,
    };
  }

  async getCharge(chargeId: string): Promise<GetChargeResult> {
    const response = await fetch(`${this.baseUrl}/charges/${encodeURIComponent(chargeId)}`, {
      headers: { Authorization: this.authHeader },
    });

    if (!response.ok) {
      throw new Error(`Omise get charge failed: ${response.status}`);
    }

    type OmiseGetCharge = { id: string; status: string; amount: number; paid_at?: string };
    const charge = (await response.json()) as OmiseGetCharge;

    return {
      chargeId: charge.id,
      status: mapOmiseStatus(charge.status),
      amountSatang: charge.amount,
      paidAt: charge.paid_at,
    };
  }
}

function mapOmiseStatus(status: string): ChargeStatus {
  switch (status) {
    case 'successful': return 'successful';
    case 'failed':     return 'failed';
    case 'reversed':   return 'reversed';
    default:           return 'pending';
  }
}

let _provider: PaymentProvider | null = null;

/** Returns the configured payment provider (singleton). */
export function getPaymentProvider(): PaymentProvider {
  if (_provider) return _provider;

  const secretKey = process.env.OMISE_SECRET_KEY;
  const providerEnv = process.env.PAYMENT_PROVIDER ?? 'mock';

  if (providerEnv === 'omise' && secretKey) {
    _provider = new OmisePaymentProvider(secretKey);
  } else {
    if (providerEnv === 'omise' && !secretKey) {
      console.warn('[payment] PAYMENT_PROVIDER=omise but OMISE_SECRET_KEY not set — using mock');
    }
    _provider = new MockPaymentProvider();
  }

  return _provider;
}
