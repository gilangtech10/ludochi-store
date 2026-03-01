import { LogoStoreName } from '@app/components/LogoStoreName/LogoStoreName';
import { IconButton } from '@app/components/common/buttons';
import { Container } from '@app/components/common/container/Container';
import { URLAwareNavLink } from '@app/components/common/link';
import { useCart } from '@app/hooks/useCart';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { motion } from 'framer-motion';
import { HeaderSideNav } from './HeaderSideNav';
import { useActiveSection } from './useActiveSection';

export type HeaderProps = {};

export const Header: FC<HeaderProps> = () => {
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(false);
  const { headerNavigationItems } = useSiteDetails();
  const { cart, toggleCartDrawer } = useCart();
  const { activeSection } = useActiveSection(headerNavigationItems);
  const rootLoader = useRootLoaderData();
  const hasProducts = rootLoader?.hasPublishedProducts;

  if (!headerNavigationItems) return <></>;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 relative" style={{ backgroundColor: '#1C1714', borderBottom: '1px solid #4A3F35', color: '#E8DFD4' }}>
      {/* Subtle Paper Texture Overlay for Header */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <nav aria-label="Top">
        <div className="bg-transparent">
          <div className="">
            <Container>
              {hasProducts && (
                <div className="-mb-2 flex w-full items-center justify-end gap-4 pt-2 sm:hidden">
                  {!!cart && (
                    <IconButton
                      aria-label="open shopping cart"
                      className="sm:mr-0.5 relative z-10"
                      style={{ color: '#E8DFD4' }}
                      icon={(iconProps) => (
                        <div className="relative">
                          <ShoppingBagIcon
                            {...iconProps}
                            className={clsx(iconProps.className, 'transition-colors rounded-none hover:opacity-70')}
                          />
                          {cart.items && cart.items.length > 0 && (
                            <span className="absolute -top-1 left-full -ml-2 flex h-4 min-w-[1rem] items-center justify-center px-1 text-[10px] font-bold" style={{ backgroundColor: '#C9A962', color: '#1C1714', border: '1px solid #1C1714', fontFamily: 'var(--font-label)' }}>
                              <span>
                                {cart.items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                                <span className="sr-only">items in cart, view bag</span>
                              </span>
                            </span>
                          )}
                        </div>
                      )}
                      onClick={() => toggleCartDrawer(true)}
                    />
                  )}

                  <div className="flex-auto" />
                </div>
              )}

              <div
                className={clsx(
                  'h-[var(--mkt-header-height)] flex sm:h-[var(--mkt-header-height-desktop)] flex-nowrap items-center justify-between gap-2 py-2',
                )}
              >
                <LogoStoreName className="xs:h-14 h-8" primary />
                <div className="flex flex-wrap-reverse items-center gap-x-6 sm:justify-end">
                  {headerNavigationItems && (
                    <div className="hidden h-full gap-6 md:flex relative z-10">
                      {headerNavigationItems.slice(0, 6).map(({ id, new_tab, ...navItemProps }, index) => (
                        <motion.div 
                          key={id}
                          whileHover={{ y: -2, opacity: 0.8 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                          className="flex items-center"
                        >
                          <URLAwareNavLink
                            {...navItemProps}
                            newTab={new_tab}
                            className={({ isActive }) =>
                              clsx('my-4 flex items-center whitespace-nowrap text-lg italic transition-colors duration-200', {
                                'border-b border-[#C9A962]':
                                  isActive &&
                                  (!navItemProps.url.includes('#') ||
                                    activeSection === navItemProps.url.split('#')[1].split('?')[0]),
                              })
                            }
                            style={{ fontFamily: 'var(--font-display)', color: '#E8DFD4' }}
                            prefetch="viewport"
                          >
                            {navItemProps.label}
                          </URLAwareNavLink>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end">
                    <div className="flex items-center gap-x-3 text-sm">
                      {!!cart && hasProducts && (
                        <IconButton
                          aria-label="open shopping cart"
                          className="hidden sm:mr-0.5 sm:inline-flex focus-within:!bg-transparent rounded-none relative z-10"
                          style={{ color: '#E8DFD4' }}
                          icon={(iconProps) => (
                            <div className="relative">
                              <ShoppingBagIcon
                                {...iconProps}
                                className={clsx(iconProps.className, 'transition-colors rounded-none hover:opacity-70')}
                              />
                              {cart.items && cart.items.length > 0 && (
                                <span className="absolute -top-1 left-full -ml-2 flex h-4 min-w-[1rem] items-center justify-center px-1 text-[10px] font-bold" style={{ backgroundColor: '#C9A962', color: '#1C1714', border: '1px solid #1C1714', fontFamily: 'var(--font-label)' }}>
                                  <span>
                                    {cart.items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                                    <span className="sr-only">items in cart, view bag</span>
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                          onClick={() => toggleCartDrawer(true)}
                        />
                      )}
                      {!!headerNavigationItems?.length && (
                        <IconButton
                          aria-label="open navigation menu"
                          onClick={() => setSideNavOpen(true)}
                          className="rounded-none sm:inline-flex md:hidden transition-colors hover:opacity-70"
                          style={{ color: '#E8DFD4' }}
                          icon={Bars3Icon}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </nav>
      <HeaderSideNav activeSection={activeSection} open={sideNavOpen} setOpen={setSideNavOpen} />
    </header>
  );
};
