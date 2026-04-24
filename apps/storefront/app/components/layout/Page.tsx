import { CartDrawer } from '@app/components/cart/CartDrawer';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';

export interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ className, children }) => {
  return (
    <div className={clsx('page-layout flex min-h-screen flex-col', className)} style={{ backgroundColor: '#FFFAF4' }}>
      <CartDrawer />
      <Header />
      <main className="flex-auto pb-16 md:pb-0">
        <div className="w-full">{children}</div>
      </main>
      <div className="hidden md:block"><Footer /></div>
      <BottomNav />
    </div>
  );
};
