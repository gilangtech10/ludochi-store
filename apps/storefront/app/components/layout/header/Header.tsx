import { IconButton } from '@app/components/common/buttons';
import { Container } from '@app/components/common/container/Container';
import { URLAwareNavLink } from '@app/components/common/link';
import { useCart } from '@app/hooks/useCart';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon';
import clsx from 'clsx';
import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useActiveSection } from './useActiveSection';

export type HeaderProps = {};

export const Header: FC<HeaderProps> = () => {
  const { headerNavigationItems } = useSiteDetails();
  const { cart, toggleCartDrawer } = useCart();
  const { activeSection } = useActiveSection(headerNavigationItems);
  const rootLoader = useRootLoaderData();
  const hasProducts = rootLoader?.hasPublishedProducts;

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <header
      className="hidden md:block sticky top-0 z-50 w-full"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #F0E6D6',
        boxShadow: '0 1px 8px rgba(61,43,31,0.06)',
      }}
    >
      <nav aria-label="Top">
        <Container>
          <div className="flex items-center justify-between" style={{ height: 'var(--mkt-header-height)' }}>

            {/* Brand name — mobile & desktop */}
            <Link
              to="/"
              prefetch="viewport"
              className="flex items-center"
              aria-label="LuDo-Chi — Home"
            >
              <span
                className="text-xl sm:text-2xl leading-none select-none"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#3D2B1F', letterSpacing: '0.04em' }}
              >
                LuDo-Chi
              </span>
            </Link>

            {/* Desktop: nav links (centre) */}
            {headerNavigationItems && (
              <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
                {headerNavigationItems.slice(0, 6).map(({ id, new_tab, ...navItemProps }) => (
                  <motion.div
                    key={id}
                    whileHover={{ y: -1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <URLAwareNavLink
                      {...navItemProps}
                      newTab={new_tab}
                      className={({ isActive }) =>
                        clsx(
                          'whitespace-nowrap text-sm font-semibold transition-colors duration-200 pb-0.5',
                          isActive &&
                            (!navItemProps.url.includes('#') ||
                              activeSection === navItemProps.url.split('#')[1].split('?')[0])
                            ? 'text-[#6B3A1F] border-b-2 border-[#6B3A1F]'
                            : 'text-[#3D2B1F] hover:text-[#C47C3A]',
                        )
                      }
                      style={{ fontFamily: 'var(--font-body)' }}
                      prefetch="viewport"
                    >
                      {navItemProps.label}
                    </URLAwareNavLink>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Cart icon — mobile & desktop */}
            {!!cart && hasProducts && (
              <button
                aria-label="Buka keranjang"
                onClick={() => toggleCartDrawer(true)}
                className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 hover:bg-[#F0E6D6]"
              >
                <ShoppingBagIcon className="w-5 h-5" style={{ color: '#3D2B1F' }} />
                {cartCount > 0 && (
                  <span
                    className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center px-1 text-[9px] font-bold rounded-full"
                    style={{ backgroundColor: '#6B3A1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Spacer jika tidak ada cart */}
            {(!cart || !hasProducts) && <div className="w-9" />}

          </div>
        </Container>
      </nav>
    </header>
  );
};
