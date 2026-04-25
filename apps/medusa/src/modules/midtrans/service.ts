import { AbstractPaymentProvider, PaymentSessionStatus } from '@medusajs/framework/utils';
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from '@medusajs/types';
import crypto from 'crypto';

type MidtransOptions = {
  serverKey: string;
  clientKey: string;
  isProduction?: boolean;
  storefrontUrl?: string;
};

class MidtransPaymentProviderService extends AbstractPaymentProvider<MidtransOptions> {
  static identifier = 'midtrans';

  private serverKey: string;
  private clientKey: string;
  private storefrontUrl: string;
  private snapBaseUrl: string;
  private coreBaseUrl: string;

  constructor(container: Record<string, unknown>, options: MidtransOptions) {
    super(container, options);
    this.serverKey = options.serverKey;
    this.clientKey = options.clientKey;
    this.storefrontUrl = options.storefrontUrl ?? 'http://localhost:3000';
    const prod = options.isProduction ?? false;
    this.snapBaseUrl = prod
      ? 'https://app.midtrans.com/snap/v1'
      : 'https://app.sandbox.midtrans.com/snap/v1';
    this.coreBaseUrl = prod
      ? 'https://api.midtrans.com/v2'
      : 'https://api.sandbox.midtrans.com/v2';
  }

  private authHeader(): string {
    return 'Basic ' + Buffer.from(this.serverKey + ':').toString('base64');
  }

  private async createSnapTransaction(
    orderId: string,
    amount: number,
    customer?: { firstName?: string; lastName?: string; email?: string },
  ): Promise<{ token: string; redirect_url: string }> {
    const res = await fetch(`${this.snapBaseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.authHeader(),
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: amount },
        customer_details: {
          first_name: customer?.firstName ?? '',
          last_name: customer?.lastName ?? '',
          email: customer?.email ?? '',
        },
        callbacks: {
          finish: `${this.storefrontUrl}/checkout/success?order_id=${orderId}`,
          error: `${this.storefrontUrl}/checkout?error=payment_failed`,
          pending: `${this.storefrontUrl}/checkout?status=pending`,
        },
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Midtrans Snap error: ${JSON.stringify(err)}`);
    }
    return res.json();
  }

  private async getTransactionStatus(orderId: string) {
    const res = await fetch(`${this.coreBaseUrl}/${orderId}/status`, {
      headers: { Accept: 'application/json', Authorization: this.authHeader() },
    });
    return res.json() as Promise<{
      transaction_status: string;
      transaction_id: string;
      status_code: string;
    }>;
  }

  private toSessionStatus(transactionStatus?: string): PaymentSessionStatus {
    switch (transactionStatus) {
      case 'settlement':
      case 'capture':
        return PaymentSessionStatus.AUTHORIZED;
      case 'pending':
        return PaymentSessionStatus.PENDING;
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        return PaymentSessionStatus.ERROR;
      default:
        return PaymentSessionStatus.PENDING;
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const amount = Number(input.amount);
    const orderId = `LUDOCHI-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const customer = input.context?.customer as
      | { first_name?: string; last_name?: string; email?: string }
      | undefined;

    const snap = await this.createSnapTransaction(orderId, amount, {
      firstName: customer?.first_name,
      lastName: customer?.last_name,
      email: customer?.email,
    });

    return {
      id: snap.token,
      data: {
        snap_token: snap.token,
        snap_redirect_url: snap.redirect_url,
        order_id: orderId,
        amount,
        currency: input.currency_code,
      },
    };
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const orderId = input.data?.order_id as string | undefined;
    if (!orderId) {
      return { status: PaymentSessionStatus.ERROR, data: input.data };
    }
    try {
      const status = await this.getTransactionStatus(orderId);
      return {
        status: this.toSessionStatus(status.transaction_status),
        data: {
          ...input.data,
          transaction_id: status.transaction_id,
          transaction_status: status.transaction_status,
        },
      };
    } catch {
      return { status: PaymentSessionStatus.PENDING, data: input.data };
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return { data: input.data };
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const orderId = input.data?.order_id as string | undefined;
    if (orderId) {
      await fetch(`${this.coreBaseUrl}/${orderId}/cancel`, {
        method: 'POST',
        headers: { Accept: 'application/json', Authorization: this.authHeader() },
      }).catch(() => {});
    }
    return { data: input.data };
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return this.cancelPayment(input);
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const orderId = input.data?.order_id as string | undefined;
    if (!orderId) return { status: PaymentSessionStatus.PENDING };
    try {
      const status = await this.getTransactionStatus(orderId);
      return { status: this.toSessionStatus(status.transaction_status) };
    } catch {
      return { status: PaymentSessionStatus.PENDING };
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const orderId = input.data?.order_id as string | undefined;
    if (orderId) {
      await fetch(`${this.coreBaseUrl}/${orderId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: this.authHeader(),
        },
        body: JSON.stringify({
          refund_key: `REFUND-${Date.now()}`,
          amount: Number(input.amount),
          reason: 'Customer refund',
        }),
      }).catch(() => {});
    }
    return { data: input.data };
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return { data: input.data };
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const result = await this.initiatePayment({
      amount: input.amount,
      currency_code: input.currency_code,
      context: input.context,
      data: input.data,
    });
    return { data: result.data };
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload['payload'],
  ): Promise<WebhookActionResult> {
    try {
      const notif = webhookData.data as {
        order_id: string;
        transaction_status: string;
        gross_amount: string;
        signature_key: string;
        status_code: string;
        transaction_id: string;
      };

      const expectedSig = crypto
        .createHash('sha512')
        .update(`${notif.order_id}${notif.status_code}${notif.gross_amount}${this.serverKey}`)
        .digest('hex');

      if (expectedSig !== notif.signature_key) {
        return { action: 'not_supported' };
      }

      const amount = Math.round(parseFloat(notif.gross_amount));
      const sessionId = notif.order_id;

      if (['settlement', 'capture'].includes(notif.transaction_status)) {
        return { action: 'captured', data: { session_id: sessionId, amount } };
      }
      if (['deny', 'cancel', 'expire', 'failure'].includes(notif.transaction_status)) {
        return { action: 'failed', data: { session_id: sessionId, amount } };
      }

      return { action: 'not_supported' };
    } catch {
      return { action: 'not_supported' };
    }
  }
}

export default MidtransPaymentProviderService;
