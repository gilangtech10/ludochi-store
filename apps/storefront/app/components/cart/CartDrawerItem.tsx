import { Button } from '@app/components/common/buttons/Button';
import { Image } from '@app/components/common/images/Image';
import { useRemoveCartItem } from '@app/hooks/useRemoveCartItem';
import { formatLineItemPrice } from '@libs/util/prices';
import { StoreCartLineItem } from '@medusajs/types';
import clsx from 'clsx';
import type { FC } from 'react';

export interface CartDrawerItemProps {
  item: StoreCartLineItem;
  currencyCode: string;
  isRemoving?: boolean;
}

export const CartDrawerItem: FC<CartDrawerItemProps> = ({ item, currencyCode, isRemoving }) => {
  const removeCartItem = useRemoveCartItem();
  const handleRemoveFromCart = () => removeCartItem.submit(item);

  return (
    <li
      className={clsx(
        'flex gap-4 px-5 py-4 transition-all duration-300 overflow-hidden',
        isRemoving ? 'opacity-0 max-h-0 py-0' : 'opacity-100 max-h-40',
      )}
    >
      {/* Product image */}
      <div
        className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
        style={{ backgroundColor: '#FFF3E4', border: '1.5px solid #F0E6D6' }}
      >
        <Image
          src={item.variant?.product?.thumbnail || ''}
          alt={item.product_title || 'product thumbnail'}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product info */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="text-sm leading-snug line-clamp-2"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
            >
              {item.product_title}
            </h3>
            {item.variant_title && (
              <p
                className="text-xs mt-0.5"
                style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}
              >
                {item.variant_title}
              </p>
            )}
          </div>
          <button
            onClick={handleRemoveFromCart}
            disabled={isRemoving}
            className="flex-shrink-0 text-[10px] font-semibold tracking-wider uppercase transition-opacity hover:opacity-60 disabled:opacity-40 mt-0.5"
            style={{ color: '#C4A882', fontFamily: 'var(--font-label)' }}
            aria-label="Hapus dari keranjang"
          >
            {isRemoving ? '...' : 'Hapus'}
          </button>
        </div>

        {/* Quantity & price row */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#FFF3E4', border: '1px solid #F0E6D6' }}
          >
            <span
              className="text-[11px] font-semibold"
              style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}
            >
              ×{item.quantity}
            </span>
          </div>
          <p
            className="text-base font-medium"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#C47C3A' }}
          >
            {formatLineItemPrice(item, currencyCode)}
          </p>
        </div>
      </div>
    </li>
  );
};
