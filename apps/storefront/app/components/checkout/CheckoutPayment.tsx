import { useCheckout } from '@app/hooks/useCheckout';
import { CheckoutStep } from '@app/providers/checkout-provider';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { CustomPaymentSession } from '@libs/types';
import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';
import { ManualPayment } from './ManualPayment/ManualPayment';
import { MidtransPayment } from './MidtransPayment';

const MIDTRANS_PROVIDER_ID = 'pp_midtrans_midtrans';
const MANUAL_PROVIDER_ID = 'pp_system_default';

export const CheckoutPayment: FC = () => {
  const { step, paymentProviders, cart } = useCheckout();
  const isActiveStep = step === CheckoutStep.PAYMENT;
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!cart) return null;

  const hasMidtrans = useMemo(
    () => paymentProviders?.some((p) => p.id === MIDTRANS_PROVIDER_ID),
    [paymentProviders],
  );

  const hasManual = useMemo(
    () => paymentProviders?.some((p) => p.id === MANUAL_PROVIDER_ID),
    [paymentProviders],
  );

  const paymentOptions = [
    {
      id: MIDTRANS_PROVIDER_ID,
      label: 'Midtrans',
      component: MidtransPayment,
      isActive: hasMidtrans,
    },
    {
      id: MANUAL_PROVIDER_ID,
      label: 'Test Payment',
      component: ManualPayment,
      isActive: hasManual,
    },
  ];

  const activeOptions = useMemo(
    () => paymentOptions.filter((p) => p.isActive),
    [paymentOptions],
  );

  return (
    <div className="checkout-payment">
      <div className={clsx({ 'h-0 overflow-hidden opacity-0': !isActiveStep })}>
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          {activeOptions.length > 1 && (
            <TabList className="flex gap-2 mt-5 mb-1">
              {activeOptions.map((opt, idx) => (
                <Tab key={opt.id} className="focus:outline-none">
                  <span
                    className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: idx === selectedIndex ? '#3D2B1F' : '#F0E6D6',
                      color: idx === selectedIndex ? '#FFFAF4' : '#6B3A1F',
                      fontFamily: 'var(--font-label)',
                    }}
                  >
                    {opt.label}
                  </span>
                </Tab>
              ))}
            </TabList>
          )}

          <TabPanels>
            {activeOptions.map((opt) => {
              const PaymentComponent = opt.component;
              return (
                <TabPanel key={opt.id}>
                  <PaymentComponent
                    isActiveStep={isActiveStep}
                    paymentMethods={[] as CustomPaymentSession[]}
                  />
                </TabPanel>
              );
            })}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
