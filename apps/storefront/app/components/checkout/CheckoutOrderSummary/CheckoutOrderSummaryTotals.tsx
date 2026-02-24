import { calculateEstimatedShipping } from '@libs/util/carts';
import { formatPrice } from '@libs/util/prices';
import { PromotionDTO, StoreCart, StoreCartShippingOption, StoreRegion } from '@medusajs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';
import { CheckoutOrderSummaryDiscountCode } from './CheckoutOrderSummaryDiscountCode';

export interface CheckoutOrderSummaryTotalsProps extends HTMLAttributes<HTMLDListElement> {
  cart: StoreCart & { promotions: PromotionDTO[] };
  shippingOptions: StoreCartShippingOption[];
}

export interface CheckoutOrderSummaryTotalsItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  amount?: number | null;
  region: StoreRegion;
}

const CheckoutOrderSummaryTotalsItem: FC<CheckoutOrderSummaryTotalsItemProps> = ({
  label,
  amount,
  className,
  region,
}) => (
  <div className={clsx('flex items-end justify-between text-base', className)}>
    <dt className="text-xs font-bold uppercase tracking-widest text-[#B0894A]">{label}</dt>
    <dd className="font-display font-medium text-xl text-[#2C1E16]">{formatPrice(amount || 0, { currency: region?.currency_code })}</dd>
  </div>
);

export const CheckoutOrderSummaryTotals: FC<CheckoutOrderSummaryTotalsProps> = ({ shippingOptions, cart }) => {
  const shippingMethods = cart.shipping_methods || [];
  const hasShippingMethod = shippingMethods.length > 0;
  const estimatedShipping = calculateEstimatedShipping(shippingOptions);
  const discountTotal = cart.discount_total ?? 0;
  const shippingAmount = cart.shipping_total ?? 0;
  const cartTotal = cart.total ?? 0;
  const total = hasShippingMethod ? cartTotal : cartTotal + estimatedShipping;

  return (
    <div className="border-t border-[#2C1E16]/30 px-4 py-6 sm:px-6 relative z-10">
      <CheckoutOrderSummaryDiscountCode cart={cart} />

      <dl className="flex flex-col gap-4 mt-4">
        <CheckoutOrderSummaryTotalsItem label="Subtotal" amount={cart.item_subtotal} region={cart.region!} />
        {discountTotal > 0 && (
          <CheckoutOrderSummaryTotalsItem label="Diskon" amount={-discountTotal} region={cart.region!} />
        )}
        {hasShippingMethod && (
          <CheckoutOrderSummaryTotalsItem label="Ongkos Kirim" amount={shippingAmount} region={cart.region!} />
        )}
        {!hasShippingMethod && (
          <CheckoutOrderSummaryTotalsItem label="Prakiraan Ongkos Kirim" amount={estimatedShipping} region={cart.region!} />
        )}
        <CheckoutOrderSummaryTotalsItem label="Pajak" amount={cart.tax_total} region={cart.region!} />
        <CheckoutOrderSummaryTotalsItem
          label="Total Mahar"
          amount={total}
          className="border-t border-[#2C1E16]/30 pt-6 !text-2xl mt-4"
          region={cart.region!}
        />
      </dl>
    </div>
  );
};
