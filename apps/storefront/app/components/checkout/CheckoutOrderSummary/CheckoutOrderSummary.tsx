import { useCheckout } from '@app/hooks/useCheckout';
import { PromotionDTO, StoreCart } from '@medusajs/types';
import { FC, ReactNode } from 'react';
import { CheckoutOrderSummaryItems } from './CheckoutOrderSummaryItems';
import { CheckoutOrderSummaryTotals } from './CheckoutOrderSummaryTotals';

export interface CheckoutOrderSummaryProps {
  submitButton?: ReactNode;
  name: string;
}

export const CheckoutOrderSummary: FC<CheckoutOrderSummaryProps> = ({ submitButton, name }) => {
  const { shippingOptions, cart } = useCheckout();

  if (!cart) return null;

  return (
    <div className="my-0 rounded-none border border-[#2C1E16]/30 bg-[#F5F2EB]/50 backdrop-blur-sm shadow-none relative">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E")' }}></div>
      <div className="relative z-10">
        <h3 className="sr-only">Pesanan Anda</h3>
        <CheckoutOrderSummaryItems cart={cart} name={name} />
        <CheckoutOrderSummaryTotals
          cart={cart as StoreCart & { promotions: PromotionDTO[] }}
          shippingOptions={shippingOptions}
        />
        {submitButton && <div className="border-t border-[#2C1E16]/30 p-4 sm:p-6">{submitButton}</div>}
      </div>
    </div>
  );
};
