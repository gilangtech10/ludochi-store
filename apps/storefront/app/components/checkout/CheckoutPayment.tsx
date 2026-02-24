import { Button } from '@app/components/common/buttons/Button';
import { useCheckout } from '@app/hooks/useCheckout';
import { useEnv } from '@app/hooks/useEnv';
import { CheckoutStep } from '@app/providers/checkout-provider';
import { Tab } from '@headlessui/react';
import { CustomPaymentSession } from '@libs/types';
import clsx from 'clsx';
import { FC, useMemo } from 'react';
import { ManualPayment } from './ManualPayment/ManualPayment';
import { StripePayment } from './StripePayment';

export const CheckoutPayment: FC = () => {
  const { env } = useEnv();
  const { step, paymentProviders, cart } = useCheckout();
  const isActiveStep = step === CheckoutStep.PAYMENT;

  if (!cart) return null;

  const hasStripePaymentProvider = useMemo(
    () => paymentProviders?.some((p) => p.id.includes('pp_stripe_stripe')),
    [paymentProviders],
  );

  const hasManualPaymentProvider = useMemo(
    () => !!paymentProviders?.some((p) => p.id.includes('pp_system_default')),
    [paymentProviders],
  );

  const paymentOptions = [
    {
      id: 'pp_stripe_stripe',
      label: 'Credit Card',
      component: StripePayment,
      isActive: hasStripePaymentProvider,
    },
    {
      id: 'pp_system_default',
      label: 'Test Payment',
      component: ManualPayment,
      isActive: hasManualPaymentProvider && env.NODE_ENV === 'development',
    },
  ];

  const activePaymentOptions = useMemo(() => paymentOptions.filter((p) => p.isActive), [paymentOptions]);

  return (
    <div className="checkout-payment">
      <div className={clsx({ 'h-0 overflow-hidden opacity-0': !isActiveStep })}>
        <Tab.Group>
          {activePaymentOptions.length > 1 && (
            <Tab.List className="bg-transparent mb-4 mt-6 inline-flex gap-1 rounded-none p-1 border border-[#2C1E16]/20">
              {activePaymentOptions.map((paymentOption, index) => (
                <Tab
                  as={Button}
                  key={paymentOption.id}
                  className={({ selected }) =>
                    clsx('!rounded-none transition-colors duration-300 font-display italic tracking-wide', {
                      '!bg-[#2C1E16] !text-[#F5F2EB] shadow-none !border-[#2C1E16]': selected,
                      'bg-transparent !text-[#2C1E16] hover:!bg-[#B0894A]/10 !border-transparent':
                        !selected,
                    })
                  }
                >
                  {paymentOption.label}
                </Tab>
              ))}
            </Tab.List>
          )}

          <Tab.Panels>
            {activePaymentOptions.map((paymentOption) => {
              const PaymentComponent = paymentOption.component;

              return (
                <Tab.Panel key={paymentOption.id}>
                  <PaymentComponent isActiveStep={isActiveStep} paymentMethods={[] as CustomPaymentSession[]} />
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};
