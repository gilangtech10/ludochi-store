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
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-none border border-[#2C1E16] bg-[#2C1E16]">
        <Image
          src={item.variant?.product?.thumbnail || ''}
          alt={item.product_title || 'product thumbnail'}
          className="h-full w-full object-cover object-center grayscale-[30%] sepia-[20%]"
        />
      </div>

      <div className="ml-5 flex flex-1 flex-col">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-display font-medium text-[#2C1E16] leading-tight">{item.product_title}</h3>
              <p className="mt-1 font-body text-sm italic text-[#2C1E16]/70">{item.variant_title}</p>
            </div>
            <Button variant="link" onClick={handleRemoveFromCart} disabled={isRemoving} className="text-xs !text-[#2C1E16]/40 hover:!text-[#B0894A] uppercase tracking-widest !p-0">
              {isRemoving ? 'Mengahapus' : 'Hapus'}
            </Button>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-end justify-between border-t border-[#2C1E16]/10 pt-2 mt-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B0894A]">Jml {item.quantity}</p>

          <div className="flex">
            <p className="font-display font-medium text-lg text-[#2C1E16]">{formatLineItemPrice(item, currencyCode)}</p>
          </div>
        </div>
      </div>
    </li>
  );
};
