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

  if (!headerNavigationItems) return <>Loading...</>;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5F2EB] border-b-4 border-double border-[#2C1E16]/30 text-[#2C1E16] transition-all duration-300 relative">
      {/* Subtle Paper Texture Overlay for Header */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <nav aria-label="Top">
        <div className="bg-transparent">
          <div className="">
            <Container>
              {hasProducts && (
                <div className="-mb-2 flex w-full items-center justify-end gap-4 pt-2 sm:hidden">
                  {!!cart && (
                    <IconButton
                      aria-label="open shopping cart"
                      className="text-[#2C1E16] sm:mr-0.5 relative z-10"
                      icon={(iconProps) => (
                        <div className="relative">
                          <ShoppingBagIcon
                            {...iconProps}
                            className={clsx(iconProps.className, 'hover:!text-[#B0894A] transition-colors rounded-none')}
                          />
                          {cart.items && cart.items.length > 0 && (
                            <span className="bg-[#B0894A] absolute -top-1 left-full -ml-2 flex h-4 min-w-[1rem] items-center justify-center px-1 text-[10px] font-body font-bold text-[#F5F2EB] border border-[#F5F2EB]">
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
                        <URLAwareNavLink
                          key={id}
                          {...navItemProps}
                          newTab={new_tab}
                          className={({ isActive }) =>
                            clsx('my-4 flex items-center whitespace-nowrap text-lg font-display italic transition-colors hover:text-[#B0894A]', {
                              'text-[#B0894A] border-b border-[#B0894A]':
                                isActive &&
                                (!navItemProps.url.includes('#') ||
                                  activeSection === navItemProps.url.split('#')[1].split('?')[0]),
                              'text-[#2C1E16]': !isActive,
                            })
                          }
                          prefetch="viewport"
                        >
                          {navItemProps.label}
                        </URLAwareNavLink>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end">
                    <div className="flex items-center gap-x-3 text-sm">
                      {!!cart && hasProducts && (
                        <IconButton
                          aria-label="open shopping cart"
                          className="text-[#2C1E16] hidden sm:mr-0.5 sm:inline-flex focus-within:!bg-transparent rounded-none relative z-10"
                          icon={(iconProps) => (
                            <div className="relative">
                              <ShoppingBagIcon
                                {...iconProps}
                                className={clsx(iconProps.className, 'hover:!text-[#B0894A] transition-colors rounded-none')}
                              />
                              {cart.items && cart.items.length > 0 && (
                                <span className="bg-[#B0894A] absolute -top-1 left-full -ml-2 flex h-4 min-w-[1rem] items-center justify-center px-1 text-[10px] font-body font-bold text-[#F5F2EB] border border-[#F5F2EB]">
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
                          className="hover:!bg-[#2C1E16]/5 focus:!bg-[#2C1E16]/5 rounded-none sm:inline-flex text-[#2C1E16] md:hidden transition-colors"
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
