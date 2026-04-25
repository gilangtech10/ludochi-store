import { useCheckout } from '@app/hooks/useCheckout';
import { CompleteCheckoutFormData, completeCheckoutSchema } from '@app/routes/api.checkout.complete';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form';
import { type CustomPaymentSession } from '@libs/types';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import { FC, FormEvent, PropsWithChildren, useState } from 'react';
import { SubmitFunction, useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { CheckoutOrderSummary } from '.';
import { FormError } from '../common/remix-hook-form/forms/FormError';

export interface CompleteCheckoutFormProps extends PropsWithChildren {
  id: string;
  providerId: string;
  paymentMethods: CustomPaymentSession[];
  submitMessage?: string;
  className?: string;
  onSubmit?: (
    data: CompleteCheckoutFormData,
    event: FormEvent<HTMLFormElement>,
    methods: {
      setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
      submit: SubmitFunction;
    },
  ) => Promise<void>;
}

export const CompleteCheckoutForm: FC<CompleteCheckoutFormProps> = ({
  id,
  submitMessage,
  onSubmit,
  paymentMethods,
  children,
  providerId,
  className,
}) => {
  const { activePaymentSession, cart, isCartMutating } = useCheckout();

  const completeCartFetcher = useFetcher<never>({ key: FetcherKeys.cart.completeCheckout });

  const [submitting, setSubmitting] = useState(false);

  const isSubmitting = ['submitting', 'loading'].includes(completeCartFetcher.state) || submitting;

  const paymentMethodsForProvider = paymentMethods.filter((paymentMethod) => paymentMethod.provider_id === providerId);

  const hasPaymentMethods = paymentMethodsForProvider.length > 0;

  const initialPaymentMethodId = hasPaymentMethods
    ? (paymentMethodsForProvider[0].data.id as string)
    : 'new';

  if (!cart) return null;

  const defaultValues: CompleteCheckoutFormData = {
    cartId: cart.id,
    paymentMethodId: initialPaymentMethodId,
    providerId,
  };

  const form = useRemixForm({
    resolver: zodResolver(completeCheckoutSchema),
    defaultValues,
    fetcher: completeCartFetcher,
    submitConfig: {
      method: 'post',
      action: '/api/checkout/complete',
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);

    const data = form.getValues();

    if (typeof onSubmit === 'function') {
      return await onSubmit(data, event, {
        setSubmitting,
        submit: () => form.handleSubmit(),
      });
    }

    return form.handleSubmit();
  };

  const hasShippingMethod = (cart.shipping_methods?.length ?? 0) > 0;

  const PaymentSubmitButton = () => (
    <button
      form={id}
      type="submit"
      disabled={isSubmitting || isCartMutating || !hasShippingMethod}
      className="w-full lg:w-auto px-10 py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
      style={{
        backgroundColor: '#3D2B1F',
        color: '#FFFAF4',
        fontFamily: 'var(--font-label)',
        letterSpacing: '0.06em',
      }}
    >
      {isSubmitting ? 'Memproses…' : (submitMessage ?? 'Konfirmasi & Bayar')}
    </button>
  );

  if (!activePaymentSession) return null;

  return (
    <>
      <RemixFormProvider {...form}>
        <completeCartFetcher.Form id={id} onSubmit={handleSubmit} className={className}>
          <TextField type="hidden" name="cartId" value={cart.id} />
          <TextField type="hidden" name="providerId" value={providerId} />

          {!hasPaymentMethods && <input type="hidden" name="paymentMethodId" value="new" />}

          <div className={`stripe-payment-form ${initialPaymentMethodId !== 'new' ? 'hidden' : ''}`}>{children}</div>

          <FormError />
        </completeCartFetcher.Form>

        <div className="block lg:hidden">
          <CheckoutOrderSummary name="checkout" submitButton={<PaymentSubmitButton />} />
        </div>

        <div className="hidden lg:block">
          <PaymentSubmitButton />
        </div>
      </RemixFormProvider>
    </>
  );
};
