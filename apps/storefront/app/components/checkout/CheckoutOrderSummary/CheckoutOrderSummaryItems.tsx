import { LineItemQuantitySelect } from '@app/components/cart/line-items/LineItemQuantitySelect';
import { Button } from '@app/components/common/buttons/Button';
import { Image } from '@app/components/common/images/Image';
import { useCheckout } from '@app/hooks/useCheckout';
import { useRemoveCartItem } from '@app/hooks/useRemoveCartItem';
import { formatPrice } from '@libs/util/prices';
import { StoreCart, StoreCartLineItem } from '@medusajs/types';
import { FC } from 'react';
import { Link } from 'react-router';

export interface CheckoutOrderSummaryItemsProps {
  cart: StoreCart;
  name: string;
}

export interface CheckoutOrderSummaryItemProps {
  item: StoreCartLineItem;
  name: string;
}

export const CheckoutOrderSummaryItem: FC<CheckoutOrderSummaryItemProps> = ({ item, name }) => {
  const { cart } = useCheckout();
  const removeCartItem = useRemoveCartItem();
  const handleRemoveFromCart = () => removeCartItem.submit(item);
  const isRemovingFromCart = ['loading', 'submitting'].includes(removeCartItem.state);

  if (!cart) return null;

  return (
    <li className="flex px-4 py-6 sm:px-6">
      <div className="flex-shrink-0 bg-[#2C1E16] rounded-none overflow-hidden h-24 border border-[#2C1E16]">
        <Image
          src={item.variant?.product?.thumbnail || ''}
          alt={item.product_title || 'product thumbnail'}
          className="w-20 h-full object-cover object-center rounded-none grayscale-[30%] sepia-[20%]"
        />
      </div>

      <div className="ml-6 flex flex-1 flex-col">
        <div className="flex">
          <div className="min-w-0 flex-1">
            <h4 className="text-xl">
              <Link to={`/products/${item.product_handle}`} className="font-display font-medium text-lg text-[#2C1E16] hover:text-[#B0894A] transition-colors leading-tight">
                {item.product_title}
              </Link>
            </h4>
            <p className="mt-1 font-body text-sm italic text-[#2C1E16]/70">{item.variant_title}</p>
          </div>

          <div className="ml-4 flow-root flex-shrink-0">
            <Button variant="link" onClick={handleRemoveFromCart} disabled={isRemovingFromCart} className="text-xs !text-[#2C1E16]/40 hover:!text-[#B0894A] uppercase tracking-widest !p-0 transition-colors">
              {isRemovingFromCart ? 'Menghapus' : 'Hapus'}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 items-end justify-between pt-2">
          <div className="mr-4">
            <LineItemQuantitySelect formId={`quantity-${name}-${item.id}`} item={item} />
          </div>

          <p className="mt-1 text-lg">
            <span className="font-display font-medium text-xl text-[#2C1E16]">
              {formatPrice(item.unit_price, {
                currency: cart.region?.currency_code,
              })}
            </span>
          </p>
        </div>
      </div>
    </li>
  );
};

export const CheckoutOrderSummaryItems: FC<CheckoutOrderSummaryItemsProps> = ({ cart, name }) => (
  <ul role="list" className="divide-y divide-[#2C1E16]/20 relative z-10">
    {cart.items?.map((item) => (
      <CheckoutOrderSummaryItem key={item.id} item={item} name={name} />
    ))}
  </ul>
);
