import { useCart } from '@app/hooks/useCart';
import { useRegion } from '@app/hooks/useRegion';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { ShoppingBagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { formatCartSubtotal, formatPrice } from '@libs/util/prices';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useState } from 'react';
import { useFetchers, useNavigate } from 'react-router';
import { CartDrawerItem } from './CartDrawerItem';

const CartDrawerHeader: FC<{ itemCount: number; onClose: () => void }> = ({ itemCount, onClose }) => (
  <div
    className="relative overflow-hidden px-5 pt-5 pb-4 flex items-start justify-between flex-shrink-0"
    style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}
  >
    {/* Decorative circles */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10"
      style={{ backgroundColor: '#E8D5B0' }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-10"
      style={{ backgroundColor: '#E8D5B0' }}
    />

    <div className="relative">
      <p
        className="text-[9px] tracking-[0.3em] uppercase mb-1"
        style={{ color: 'rgba(232,213,176,0.55)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
      >
        ショッピングカート
      </p>
      <DialogTitle
        className="text-xl leading-tight"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#FFFAF4' }}
      >
        Keranjang Saya
      </DialogTitle>
      {itemCount > 0 && (
        <p
          className="text-[11px] mt-0.5"
          style={{ color: 'rgba(255,250,244,0.5)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
        >
          {itemCount} item dipilih
        </p>
      )}
    </div>

    <button
      onClick={onClose}
      className="relative mt-0.5 w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-opacity hover:opacity-75 active:scale-95"
      style={{ backgroundColor: 'rgba(255,250,244,0.12)', border: '1px solid rgba(255,250,244,0.2)' }}
      aria-label="Tutup keranjang"
    >
      <XMarkIcon className="w-4 h-4" style={{ color: '#FFFAF4' }} />
    </button>
  </div>
);

const CartDrawerEmpty: FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
      style={{ backgroundColor: '#FFF3E4' }}
    >
      <ShoppingBagIcon className="w-7 h-7" style={{ color: '#C4A882' }} />
    </div>
    <p
      className="text-sm mb-1"
      style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
    >
      Keranjang masih kosong
    </p>
    <p className="text-xs mb-5" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
      Tambahkan produk untuk mulai memesan
    </p>
    <button
      onClick={onClose}
      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95"
      style={{ backgroundColor: '#6B3A1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
    >
      Lihat Menu <ArrowRightIcon className="w-3.5 h-3.5" />
    </button>
  </div>
);

const CartDrawerLoading: FC<{ className?: string }> = ({ className }) => (
  <li className={clsx('list-none px-5 py-4', className)}>
    <div className="flex animate-pulse gap-4">
      <div
        className="h-20 w-20 rounded-xl flex-shrink-0"
        style={{ backgroundColor: '#F0E6D6' }}
      />
      <div className="flex flex-1 flex-col gap-2.5 py-1">
        <div className="h-2.5 rounded-full w-3/4" style={{ backgroundColor: '#F0E6D6' }} />
        <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: '#F0E6D6' }} />
        <div className="mt-auto h-2 rounded-full w-1/4" style={{ backgroundColor: '#F0E6D6' }} />
      </div>
    </div>
  </li>
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

  const isCartLoading = allFetchers.some(
    (f) => (f.state === 'submitting' || f.state === 'loading') && f.key.startsWith('cart:'),
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(cartDrawerOpen === true);
  }, [cartDrawerOpen]);

  const lineItems = cart?.items ?? [];
  const lineItemsTotal = lineItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasItems = lineItems.length > 0;

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
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 ease-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* Mobile: bottom sheet | Desktop: right panel */}
          <div className="pointer-events-none fixed inset-x-0 bottom-0 sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:w-[420px]">
            <DialogPanel
              transition
              className={clsx(
                'pointer-events-auto w-full transform duration-500 ease-in-out',
                'data-[closed]:translate-y-full',
                'sm:data-[closed]:translate-y-0 sm:data-[closed]:translate-x-full',
                'sm:h-full',
              )}
            >
              <div
                className="flex flex-col overflow-hidden shadow-2xl"
                style={{
                  backgroundColor: '#FFFAF4',
                  maxHeight: '92svh',
                  borderRadius: '20px 20px 0 0',
                }}
              >
                {/* ── Drag handle (mobile only) ── */}
                <div className="sm:hidden flex justify-center pt-2.5 pb-1 flex-shrink-0" style={{ backgroundColor: '#3D2B1F' }}>
                  <div className="w-8 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,250,244,0.25)' }} />
                </div>

                {/* ── Header ── */}
                <CartDrawerHeader itemCount={lineItemsTotal} onClose={handleClose} />

                {/* ── Scrollable content ── */}
                <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FFFAF4' }}>
                  {hasItems && (
                    <ul className="list-none divide-y" style={{ borderColor: '#F0E6D6' }}>
                      {lineItems.map((item) => (
                        <CartDrawerItem
                          key={item.id}
                          isRemoving={isRemovingItemId === item.id}
                          item={item}
                          currencyCode={region.currency_code}
                        />
                      ))}
                    </ul>
                  )}

                  {(isAddingItem || isCartLoading) && (
                    <CartDrawerLoading className={hasItems ? 'border-t' : ''} />
                  )}

                  {!hasItems && !isAddingItem && !isCartLoading && (
                    <CartDrawerEmpty onClose={handleClose} />
                  )}
                </div>

                {/* ── Footer ── */}
                <div
                  className="px-5 pt-4 pb-5 flex-shrink-0"
                  style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F0E6D6' }}
                >
                  {/* Total row */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p
                        className="text-[9px] tracking-[0.25em] uppercase mb-0.5"
                        style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
                      >
                        Total Pesanan
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}
                      >
                        Belum termasuk ongkos kirim
                      </p>
                    </div>
                    <p
                      className="text-2xl"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
                    >
                      {cart
                        ? formatCartSubtotal(cart)
                        : formatPrice(0, { currency: region.currency_code })}
                    </p>
                  </div>

                  {/* Checkout button */}
                  <button
                    disabled={lineItemsTotal === 0 || navigatingToCheckout}
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#3D2B1F',
                      color: '#FFFAF4',
                      fontFamily: 'var(--font-label)',
                      boxShadow: '0 4px 14px rgba(61,43,31,0.25)',
                    }}
                  >
                    {navigatingToCheckout ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(255,250,244,0.5)', borderTopColor: 'transparent' }} />
                        Memproses…
                      </>
                    ) : (
                      <>
                        Pesan Sekarang
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center mt-3 text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                    atau{' '}
                    <button
                      onClick={handleClose}
                      className="font-semibold transition-opacity hover:opacity-70"
                      style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
                    >
                      lanjut belanja →
                    </button>
                  </p>

                  {/* iOS safe area */}
                  <div className="h-safe-b sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
