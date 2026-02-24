import { Button } from '@app/components/common/buttons/Button';
import { ButtonLink } from '@app/components/common/buttons/ButtonLink';
import { IconButton } from '@app/components/common/buttons/IconButton';
import { useCart } from '@app/hooks/useCart';
import { useRegion } from '@app/hooks/useRegion';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { formatCartSubtotal, formatPrice } from '@libs/util/prices';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useState } from 'react';
import { useFetchers, useNavigate } from 'react-router';
import { CartDrawerItem } from './CartDrawerItem';

// Cart Drawer Header Component
const CartDrawerHeader: FC<{ itemCount: number; onClose: () => void }> = ({ itemCount, onClose }) => (
  <div className="flex items-start justify-between border-b border-[#2C1E16]/20 pb-4">
    <DialogTitle className="text-2xl font-display font-medium italic text-[#2C1E16]">
      Baki Menu{' '}
      {itemCount > 0 && (
        <span className="pl-2 font-body not-italic text-sm text-[#B0894A]">
          ({itemCount} porsi)
        </span>
      )}
    </DialogTitle>
    <div className="ml-3 flex h-7 items-center">
      <IconButton icon={XMarkIcon} onClick={onClose} className="-m-2 text-[#2C1E16] hover:text-[#B0894A] transition-colors" aria-label="Tutup Panel" />
    </div>
  </div>
);

// Cart Drawer Empty Component
const CartDrawerEmpty: FC = () => <p className="text-center font-body italic text-sm text-[#2C1E16]/70 mt-8">Tampaknya bakimu masih kosong!</p>;

// Cart Drawer Loading Component
const CartDrawerLoading: FC<{ className?: string }> = ({ className }) => (
  <li className={clsx('list-none', className)}>
    <div className="flex animate-pulse space-x-4">
      <div className="h-24 w-24 rounded-md bg-slate-300" />
      <div className="flex h-24 w-full flex-1 flex-col space-y-3 py-1">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-2 rounded bg-slate-300" />
          <div className="col-span-1 h-2 rounded bg-slate-300" />
        </div>
        <div className="h-2 rounded bg-slate-300" />
        <div className="flex-1" />
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 h-2 rounded bg-slate-300" />
          <div className="col-span-2" />
          <div className="col-span-1 h-2 rounded bg-slate-300" />
        </div>
      </div>
    </div>
  </li>
);

// Cart Drawer Items Component
const CartDrawerItems: FC<{
  items: any[];
  isRemovingItemId?: string;
  currencyCode: string;
}> = ({ items, isRemovingItemId, currencyCode }) => (
  <ul className="-my-6 divide-y divide-[#2C1E16]/20 list-none mt-2">
    {items.map((item) => (
      <CartDrawerItem key={item.id} isRemoving={isRemovingItemId === item.id} item={item} currencyCode={currencyCode} />
    ))}
  </ul>
);

// Cart Drawer Content Component
const CartDrawerContent: FC<{
  items: any[];
  isRemovingItemId?: string;
  isAddingItem: boolean;
  showEmptyCartMessage: boolean;
  isRemovingLastItem: boolean;
  currencyCode: string;
}> = ({ items, isRemovingItemId, isAddingItem, showEmptyCartMessage, isRemovingLastItem, currencyCode }) => {
  // Ensure we're correctly determining when to show items vs empty message
  const hasItems = items && items.length > 0;

  return (
    <div className="mt-8">
      <div className="flow-root">
        {/* Show items when there are items in the cart */}
        {hasItems && <CartDrawerItems items={items} isRemovingItemId={isRemovingItemId} currencyCode={currencyCode} />}

        {/* Show loading item when adding items */}
        {isAddingItem && <CartDrawerLoading className={clsx(hasItems ? 'pt-10' : 'py-0')} />}

        {/* Only show empty cart message when cart is truly empty and not loading */}
        {!hasItems && !isAddingItem && <CartDrawerEmpty />}
      </div>
    </div>
  );
};

// Cart Drawer Footer Component
const CartDrawerFooter: FC<{
  navigatingToCheckout: boolean;
  cart: any;
  currencyCode: string;
  itemCount: number;
  onCheckout: () => void;
  onClose: () => void;
}> = ({ cart, currencyCode, itemCount, navigatingToCheckout, onCheckout, onClose }) => (
  <div className="border-t border-[#2C1E16]/30 px-4 py-6 sm:px-6 z-10 bg-[#F5F2EB]/80 backdrop-blur-sm">
    <div className="flex justify-between items-end text-base font-display font-medium text-[#2C1E16]">
      <p className="text-sm uppercase tracking-widest text-[#B0894A] font-bold">Total Mahar</p>
      <p className="text-2xl">
        {cart
          ? formatCartSubtotal(cart)
          : formatPrice(0, {
            currency: currencyCode,
          })}
      </p>
    </div>
    <p className="mt-2 font-body text-xs italic text-[#2C1E16]/70 hidden">Ongkos kirim dan pajak dihitung saat kasir.</p>
    <div className="mt-8">
      <Button
        variant="primary"
        disabled={itemCount === 0 || navigatingToCheckout}
        onClick={onCheckout}
        className="group relative !h-12 w-full !text-base font-display italic tracking-wide !bg-[#2C1E16] text-[#F5F2EB] !border !border-[#2C1E16] !rounded-none hover:!bg-[#F5F2EB] hover:!text-[#2C1E16] cursor-pointer transition-all duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 border border-[#B0894A] m-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <span className="relative z-10 flex items-center justify-center">
          {navigatingToCheckout ? 'Menuju Kasir...' : 'Lanjut ke Kasir'}
        </span>
      </Button>
    </div>
    <div className="mt-6 flex justify-center text-center font-body text-sm text-[#2C1E16]/70">
      <p>
        atau{' '}
        <ButtonLink size="sm" onClick={onClose} className="!text-[#B0894A] hover:!text-[#2C1E16] transition-colors italic">
          <div>
            Lanjut Memilih Menu{` `}
            <span aria-hidden="true">&rarr;</span>
          </div>
        </ButtonLink>
      </p>
    </div>
  </div>
);

export const CartDrawer: FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartDrawerOpen,
    toggleCartDrawer,
    isAddingItem,
    isRemovingItemId,
    isRemovingLastItem,
    showEmptyCartMessage,
  } = useCart();
  const { region } = useRegion();
  const allFetchers = useFetchers();
  const [navigatingToCheckout, setNavigatingToCheckout] = useState(false);

  // Track if any cart-related fetchers are active
  const isCartLoading = allFetchers.some(
    (f) => (f.state === 'submitting' || f.state === 'loading') && f.key.startsWith('cart:'),
  );

  // Local state to control the dialog - initialize with cartDrawerOpen
  const [isOpen, setIsOpen] = useState(false);

  // Sync our local state with the cart drawer state
  useEffect(() => {
    setIsOpen(cartDrawerOpen === true);
  }, [cartDrawerOpen]);

  const lineItems = cart?.items ?? [];
  const lineItemsTotal = lineItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutClick = useCallback(() => {
    setNavigatingToCheckout(true);
    navigate('/checkout');
    setTimeout(() => {
      toggleCartDrawer(false);
      setNavigatingToCheckout(false);
    }, 750);
  }, [navigate, toggleCartDrawer]);

  const handleClose = useCallback(() => {
    toggleCartDrawer(false);
  }, [toggleCartDrawer]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop with transition */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm duration-300 ease-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            {/* Panel with transition */}
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform duration-500 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-[#F5F2EB] selection:bg-[#B0894A] selection:text-[#F5F2EB] shadow-xl border-l-4 border-double border-[#2C1E16]/40 relative">
                {/* Global Paper Texture Overlay */}
                <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 z-10">
                  <CartDrawerHeader itemCount={lineItemsTotal} onClose={handleClose} />

                  <CartDrawerContent
                    items={lineItems}
                    isRemovingItemId={isRemovingItemId}
                    isAddingItem={isAddingItem || isCartLoading}
                    showEmptyCartMessage={showEmptyCartMessage}
                    isRemovingLastItem={isRemovingLastItem}
                    currencyCode={region.currency_code}
                  />
                </div>

                {/* Footer */}
                <CartDrawerFooter
                  navigatingToCheckout={navigatingToCheckout}
                  cart={cart}
                  currencyCode={region.currency_code}
                  itemCount={lineItemsTotal}
                  onCheckout={handleCheckoutClick}
                  onClose={handleClose}
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
