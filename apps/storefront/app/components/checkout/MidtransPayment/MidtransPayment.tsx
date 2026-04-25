import { useCheckout } from '@app/hooks/useCheckout';
import { useEnv } from '@app/hooks/useEnv';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import { CompleteCheckoutFormData, completeCheckoutSchema } from '@app/routes/api.checkout.complete';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomPaymentSession } from '@libs/types';
import { medusaAddressToAddress } from '@libs/util';
import { MedusaAddress } from '@libs/types';
import { ArrowRightIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import HiddenAddressGroup from '../HiddenAddressGroup';
import { FormError } from '@app/components/common/remix-hook-form/forms/FormError';
import { Checkbox, TextField } from '@lambdacurry/forms/remix-hook-form';
import { CheckoutOrderSummary } from '../CheckoutOrderSummary';
import {
  AddressForm,
  defaultAddressData,
  type AddressFormData,
} from '../AddressForm/AddressForm';
import { AddressDisplay } from '../address/AddressDisplay';

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: Record<string, unknown>) => void;
          onPending?: (result: Record<string, unknown>) => void;
          onError?: (result: Record<string, unknown>) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

const PROVIDER_ID = 'pp_midtrans_midtrans';

export interface MidtransPaymentProps {
  isActiveStep: boolean;
  paymentMethods: CustomPaymentSession[];
}

export const MidtransPayment: FC<MidtransPaymentProps> = ({ isActiveStep }) => {
  const { env } = useEnv();
  const { activePaymentSession, cart, isCartMutating } = useCheckout();
  const completeCartFetcher = useFetcher<never>({ key: FetcherKeys.cart.completeCheckout });

  const [snapReady, setSnapReady] = useState(false);
  const [snapError, setSnapError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const clientKey = env.MIDTRANS_CLIENT_KEY ?? '';
  const isProduction = env.MIDTRANS_IS_PRODUCTION === 'true';
  const snapJsUrl = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

  useEffect(() => {
    if (!clientKey || scriptRef.current) return;
    const script = document.createElement('script');
    script.src = snapJsUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    script.onload = () => setSnapReady(true);
    document.head.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [clientKey, snapJsUrl]);

  const snapToken = activePaymentSession?.data?.snap_token as string | undefined;

  const isSubmitting =
    ['submitting', 'loading'].includes(completeCartFetcher.state) || submitting;

  if (!cart) return null;

  const defaultBillingAddress = medusaAddressToAddress(cart.billing_address as MedusaAddress);
  const shippingAddress = defaultAddressData(cart?.shipping_address) ?? { address: defaultBillingAddress, completed: false };

  const countryOptions =
    (cart.region?.countries?.map((c) => ({ value: c.iso_2, label: c.display_name })) as {
      value: string;
      label: string;
    }[]) ?? [];

  const defaultValues: CompleteCheckoutFormData = {
    cartId: cart.id,
    paymentMethodId: 'new',
    sameAsShipping: true,
    billingAddress: defaultBillingAddress,
    providerId: PROVIDER_ID,
  };

  const form = useRemixForm({
    resolver: zodResolver(completeCheckoutSchema),
    defaultValues,
    fetcher: completeCartFetcher,
    submitConfig: { method: 'post', action: '/api/checkout/complete' },
  });

  const sameAsShipping = form.watch('sameAsShipping');
  const billingAddress = form.watch('billingAddress');
  const hasShippingMethod = (cart.shipping_methods?.length ?? 0) > 0;

  const setBillingAddress = (addr: AddressFormData) => {
    form.setValue('billingAddress.address1', addr.address.address1 ?? '');
    form.setValue('billingAddress.address2', addr.address.address2 ?? '');
    form.setValue('billingAddress.city', addr.address.city ?? '');
    form.setValue('billingAddress.province', addr.address.province ?? '');
    form.setValue('billingAddress.countryCode', addr.address.countryCode ?? '');
    form.setValue('billingAddress.postalCode', addr.address.postalCode ?? '');
    form.setValue('billingAddress.phone', addr.address.phone ?? '');
    form.setValue('billingAddress.firstName', addr.address.firstName ?? '');
    form.setValue('billingAddress.lastName', addr.address.lastName ?? '');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSnapError(null);

    if (!snapToken) {
      setSnapError('Token pembayaran tidak ditemukan. Coba muat ulang halaman.');
      return;
    }
    if (!snapReady || !window.snap) {
      setSnapError('Snap.js belum siap. Coba lagi sebentar.');
      return;
    }

    setSubmitting(true);

    window.snap.pay(snapToken, {
      onSuccess: () => {
        form.handleSubmit();
      },
      onPending: () => {
        form.handleSubmit();
      },
      onError: (result) => {
        setSubmitting(false);
        setSnapError('Pembayaran gagal. Silakan coba lagi.');
        console.error('Midtrans payment error:', result);
      },
      onClose: () => {
        setSubmitting(false);
      },
    });
  };

  if (!activePaymentSession) return null;

  const PayButton = () => (
    <button
      form="MidtransPaymentForm"
      type="submit"
      disabled={isSubmitting || isCartMutating || !hasShippingMethod || !snapReady}
      className="flex items-center justify-center gap-2 w-full lg:w-auto px-10 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-40"
      style={{
        backgroundColor: '#3D2B1F',
        color: '#FFFAF4',
        fontFamily: 'var(--font-label)',
        boxShadow: '0 4px 14px rgba(61,43,31,0.2)',
        letterSpacing: '0.08em',
      }}
    >
      {isSubmitting ? (
        <>
          <span
            className="w-4 h-4 rounded-full border-2 animate-spin"
            style={{ borderColor: 'rgba(255,250,244,0.35)', borderTopColor: '#FFFAF4' }}
          />
          Menunggu…
        </>
      ) : (
        <>
          <CreditCardIcon className="w-4 h-4" />
          Bayar dengan Midtrans
        </>
      )}
    </button>
  );

  return (
    <RemixFormProvider {...form}>
      <completeCartFetcher.Form id="MidtransPaymentForm" onSubmit={handleSubmit} className="mt-4">
        <TextField type="hidden" name="cartId" value={cart.id} />
        <TextField type="hidden" name="providerId" value={PROVIDER_ID} />
        <input type="hidden" name="paymentMethodId" value="new" />

        {/* Metode pembayaran yang tersedia */}
        <div
          className="rounded-2xl px-4 py-3 mb-4"
          style={{ backgroundColor: '#FFF3E4', border: '1px solid #F0E6D6' }}
        >
          <p
            className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-1"
            style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
          >
            支払い方法
          </p>
          <p className="text-xs" style={{ color: '#6B3A1F', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
            Kartu kredit/debit, GoPay, OVO, DANA, ShopeePay, QRIS, transfer bank, dan Indomaret/Alfamart.
          </p>
        </div>

        {/* Billing address */}
        <h3
          className="text-[9px] tracking-[0.2em] uppercase font-semibold mt-5 mb-2"
          style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}
        >
          Alamat Tagihan
        </h3>

        <Checkbox className="mb-3" name="sameAsShipping" label="Sama dengan alamat pengiriman" />

        {!sameAsShipping && (
          <AddressForm
            mode="billing"
            address={billingAddress}
            setAddress={setBillingAddress}
          />
        )}

        <HiddenAddressGroup address={billingAddress} prefix="billingAddress" />

        {sameAsShipping && (
          <div className="-mt-1 mb-4">
            <AddressDisplay address={shippingAddress.address} countryOptions={countryOptions} />
          </div>
        )}

        {snapError && (
          <p className="text-xs mt-2 mb-1 px-1" style={{ color: '#B91C1C', fontFamily: 'var(--font-body)' }}>
            {snapError}
          </p>
        )}

        <FormError />
      </completeCartFetcher.Form>

      <div className="block lg:hidden mt-4">
        <CheckoutOrderSummary name="checkout" submitButton={<PayButton />} />
      </div>
      <div className="hidden lg:block mt-6">
        <PayButton />
      </div>
    </RemixFormProvider>
  );
};
