import { useSiteDetails } from '@app/hooks/useSiteDetails';
import clsx from 'clsx';
import type { FC } from 'react';
import { Link } from 'react-router';

export const LogoStoreName: FC<{ primary?: boolean; className?: string }> = ({ primary, className }) => {
  const { store, settings } = useSiteDetails();

  if (!store || !settings) return null;

  return (
    <Link
      viewTransition
      to="/"
      prefetch="viewport"
      className={clsx('logo-header flex flex-nowrap items-center justify-center', className)}
      aria-label={store.name}
    >
      <img
        src="/logo.jpeg"
        alt={store.name}
        className="h-full w-auto object-contain"
        style={{ maxHeight: '100%' }}
      />
    </Link>
  );
};
