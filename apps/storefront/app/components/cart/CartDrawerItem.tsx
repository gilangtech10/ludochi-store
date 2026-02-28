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
      key={item.id}
      className={clsx('flex h-36 py-6 opacity-100 transition-all', {
        '!h-0 !p-0 !opacity-0': isRemoving,
      })}
    >
      <div
        className="h-24 w-24 flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: '#1C1714', border: '1px solid #4A3F35' }}
      >
        <Image
          src={item.variant?.product?.thumbnail || ''}
          alt={item.product_title || 'product thumbnail'}
          className="h-full w-full object-cover object-center sepia-aged"
        />
      </div>

      <div className="ml-5 flex flex-1 flex-col">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3
                className="leading-tight"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.1rem', color: '#E8DFD4' }}
              >
                {item.product_title}
              </h3>
              <p className="mt-1 italic text-sm" style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}>
                {item.variant_title}
              </p>
            </div>
            <Button
              variant="link"
              onClick={handleRemoveFromCart}
              disabled={isRemoving}
              className="!p-0 transition-colors"
              style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B7A' }}
            >
              {isRemoving ? 'Removing…' : 'Remove'}
            </Button>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-end justify-between pt-2 mt-2" style={{ borderTop: '1px solid rgba(74,63,53,0.4)' }}>
          <span className="academia-label">Qty {item.quantity}</span>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.05rem', color: '#C9A962' }}>
            {formatLineItemPrice(item, currencyCode)}
          </p>
        </div>
      </div>
    </li>
  );
};
