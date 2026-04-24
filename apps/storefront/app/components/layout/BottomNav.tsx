import { useCart } from '@app/hooks/useCart';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import {
  HomeIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  Squares2X2Icon as Squares2X2Solid,
  ShoppingBagIcon as ShoppingBagSolid,
  UserCircleIcon as UserCircleSolid,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router';

const NAV_ITEMS = [
  { label: 'Home',      href: '/',         icon: HomeIcon,        activeIcon: HomeIconSolid },
  { label: 'Menu',      href: '/products', icon: Squares2X2Icon,  activeIcon: Squares2X2Solid },
  { label: 'Keranjang', href: null,         icon: ShoppingBagIcon, activeIcon: ShoppingBagSolid },
  { label: 'Akun',      href: '/account',  icon: UserCircleIcon,  activeIcon: UserCircleSolid },
];

export const BottomNav = () => {
  const location = useLocation();
  const { cart, toggleCartDrawer } = useCart();
  const rootLoader = useRootLoaderData();
  const hasProducts = rootLoader?.hasPublishedProducts;

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(226,204,176,0.6)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 16px rgba(61,43,31,0.06)',
      }}
    >
      <div className="flex items-stretch h-[60px]">
        {NAV_ITEMS.map((item) => {
          const isCart = item.href === null;

          if (isCart && !hasProducts) return null;

          const isActive = !isCart && (
            item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href!)
          );

          const Icon = isActive ? item.activeIcon : item.icon;
          const labelColor = isActive ? '#6B3A1F' : '#9C8070';
          const iconColor = isActive ? '#6B3A1F' : '#9C8070';

          const inner = (
            <>
              <div className="relative">
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
                {isCart && cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center px-1 text-[9px] font-bold rounded-full"
                    style={{ backgroundColor: '#C47C3A', color: '#FFFFFF', fontFamily: 'var(--font-label)' }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-bold mt-0.5 tracking-wide"
                style={{ color: labelColor, fontFamily: 'var(--font-label)' }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-b-full"
                  style={{ backgroundColor: '#C47C3A' }}
                />
              )}
            </>
          );

          const baseClass = clsx(
            'relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:opacity-60',
          );

          if (isCart) {
            return (
              <button
                key="cart"
                onClick={() => toggleCartDrawer(true)}
                className={baseClass}
                aria-label="Buka keranjang"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {inner}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href!}
              prefetch="viewport"
              className={baseClass}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
