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
  <div className="flex items-start justify-between pb-4" style={{ borderBottom: '1px solid #4A3F35' }}>
    <DialogTitle
      className="text-2xl tracking-tight"
      style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic', color: '#E8DFD4' }}
    >
      Your Selection{' '}
      {itemCount > 0 && (
        <span
          className="pl-2 not-italic text-sm"
          style={{ fontFamily: 'var(--font-label)', letterSpacing: '0.15em', color: '#C9A962' }}
        >
          ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      )}
    </DialogTitle>
    <div className="ml-3 flex h-7 items-center">
      <IconButton
        icon={XMarkIcon}
        onClick={onClose}
        className="-m-2 transition-colors"
        style={{ color: '#9C8B7A' }}
        aria-label="Close cart"
      />
    </div>
  </div>
);

// Cart Drawer Empty Component
const CartDrawerEmpty: FC = () => (
  <p
    className="text-center italic text-sm mt-8"
    style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
  >
    Your selection is currently empty.
  </p>
);

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
  <ul className="-my-6 list-none mt-2" style={{ borderColor: '#4A3F35' }}>
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
  <div
    className="px-4 py-6 sm:px-6 z-10"
    style={{ borderTop: '1px solid #4A3F35', backgroundColor: '#1C1714' }}
  >
    <div className="flex justify-between items-end" style={{ fontFamily: 'var(--font-display)', color: '#E8DFD4' }}>
      <p
        style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A962' }}
      >
        Order Total
      </p>
      <p className="text-2xl">
        {cart
          ? formatCartSubtotal(cart)
          : formatPrice(0, { currency: currencyCode })}
      </p>
    </div>
    <div className="mt-8">
      <Button
        variant="primary"
        disabled={itemCount === 0 || navigatingToCheckout}
        onClick={onCheckout}
        className="btn-brass engraved !h-12 w-full !text-base cursor-pointer"
      >
        {navigatingToCheckout ? 'Redirecting…' : 'Proceed to Checkout'}
      </Button>
    </div>
    <div className="mt-6 flex justify-center text-center">
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#9C8B7A' }}>
        or{' '}
        <ButtonLink
          size="sm"
          onClick={onClose}
          className="italic transition-colors"
          style={{ color: '#C9A962' }}
        >
          Continue Browsing <span aria-hidden="true">&rarr;</span>
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
              <div className="flex h-full flex-col overflow-y-scroll selection:bg-[#C9A962] selection:text-[#1C1714] shadow-xl relative" style={{ backgroundColor: '#1C1714', borderLeft: '1px solid #4A3F35' }}>
                {/* Paper Texture overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none fixed inset-0 z-0 mix-blend-overlay"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, opacity: 0.03 }}
                />

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
