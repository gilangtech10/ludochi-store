import { IconButton } from '@app/components/common/buttons';
import { URLAwareNavLink } from '@app/components/common/link';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { Dialog, Transition } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import clsx from 'clsx';
import { type FC, Fragment } from 'react';

export interface HeaderSideNavProps {
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  activeSection?: string | null;
}

export const HeaderSideNav: FC<HeaderSideNavProps> = ({ open, setOpen, activeSection }) => {
  const { headerNavigationItems } = useSiteDetails();

  return (
    <Transition.Root show={!!open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#3D2B1F] bg-opacity-30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xs">
                  <div
                    className="flex h-full flex-col overflow-y-scroll shadow-xl"
                    style={{ backgroundColor: '#FFFAF4', borderLeft: '2px solid #E2CCB0' }}
                  >
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      <div className="flex items-center justify-between mb-8">
                        <Dialog.Title
                          className="text-xl font-bold"
                          style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
                        >
                          Menu
                        </Dialog.Title>
                        <IconButton
                          icon={XMarkIcon}
                          onClick={() => setOpen(false)}
                          className="-m-2 rounded-full"
                          aria-label="Close panel"
                          style={{ color: '#3D2B1F' }}
                        />
                      </div>

                      {!!headerNavigationItems?.length && (
                        <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                          {headerNavigationItems.map(({ id, new_tab, ...navItemProps }) => (
                            <URLAwareNavLink
                              key={id}
                              {...navItemProps}
                              newTab={new_tab}
                              onClick={() => setOpen(false)}
                              className={({ isActive }) => {
                                const active = isActive &&
                                  (!navItemProps.url.includes('#') ||
                                    activeSection === navItemProps.url.split('#')[1].split('?')[0]);
                                return clsx(
                                  'flex items-center rounded-2xl px-5 py-3 text-base font-semibold transition-colors duration-200',
                                  active
                                    ? 'text-[#FFFAF4] bg-[#6B3A1F]'
                                    : 'text-[#3D2B1F] hover:text-[#6B3A1F] hover:bg-[#E8D5B0]',
                                );
                              }}
                              style={{ fontFamily: 'var(--font-body)' }}
                              prefetch="viewport"
                            >
                              <span className="flex-1">{navItemProps.label}</span>
                            </URLAwareNavLink>
                          ))}
                        </nav>
                      )}
                    </div>

                    <div className="px-6 pb-8">
                      <p
                        className="text-xs text-center"
                        style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}
                      >
                        ドーナツと餅パン ✿
                      </p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
