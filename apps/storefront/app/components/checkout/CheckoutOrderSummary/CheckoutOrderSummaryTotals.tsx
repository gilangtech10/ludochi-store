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

const CheckoutOrderSummaryTotalsItem: FC<CheckoutOrderSummaryTotalsItemProps> = ({ label, amount, className, region }) => (
  <div className={clsx('flex items-end justify-between text-base', className)}>
    <dt
      style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A962' }}
    >
      {label}
    </dt>
    <dd style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.15rem', color: '#E8DFD4' }}>
      {formatPrice(amount || 0, { currency: region?.currency_code })}
    </dd>
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
    <div className="px-4 py-6 sm:px-6 relative z-10" style={{ borderTop: '1px solid #4A3F35' }}>
      <CheckoutOrderSummaryDiscountCode cart={cart} />

      <dl className="flex flex-col gap-4 mt-4">
        <CheckoutOrderSummaryTotalsItem label="Subtotal" amount={cart.item_subtotal} region={cart.region!} />
        {discountTotal > 0 && (
          <CheckoutOrderSummaryTotalsItem label="Discount" amount={-discountTotal} region={cart.region!} />
        )}
        {hasShippingMethod && (
          <CheckoutOrderSummaryTotalsItem label="Shipping" amount={shippingAmount} region={cart.region!} />
        )}
        {!hasShippingMethod && (
          <CheckoutOrderSummaryTotalsItem label="Est. Shipping" amount={estimatedShipping} region={cart.region!} />
        )}
        <CheckoutOrderSummaryTotalsItem label="Tax" amount={cart.tax_total} region={cart.region!} />
        <CheckoutOrderSummaryTotalsItem
          label="Order Total"
          amount={total}
          className="pt-6 !text-2xl mt-4"
          style={{ borderTop: '1px solid #4A3F35' }}
          region={cart.region!}
        />
      </dl>
    </div>
  );
};
