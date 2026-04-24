import { URLAwareNavLink } from '@app/components/common/link';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import { CustomAction } from '@libs/types';
import { FC, PropsWithChildren, ReactNode } from 'react';

export interface ProductListHeaderProps extends PropsWithChildren {
  className?: string;
  heading?: ReactNode;
  text?: string;
  actions?: CustomAction[];
  customActions?: ReactNode;
}

export const ProductListHeader: FC<ProductListHeaderProps> = ({ heading, children, text, actions, customActions }) => {
  if (!(heading || children) && !text && !actions?.length && !customActions) return null;

  return (
    <header className="mb-6 flex flex-col items-start xs:items-end gap-2 md:mb-8 xs:flex-row md:gap-4">
      <div className="w-full flex-1 md:w-auto">
        <div className="inline-grid gap-3">
          {(heading || children) && (
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
            >
              {heading || children}
            </h2>
          )}
          {text && (
            <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#9C8070' }}>
              {text}
            </p>
          )}
        </div>
      </div>

      {!!actions?.length && (
        <div className="flex grow-0 items-center gap-2">
          {actions.map(({ label, url }, index) => {
            if (!label) return null;
            return (
              <URLAwareNavLink
                key={index}
                url={url}
                prefetch="render"
                className="flex items-center transition-colors"
                style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', letterSpacing: '0.05em', color: '#C47C3A' }}
              >
                {label}
                <ArrowRightIcon className="ml-1.5 h-3.5" />
              </URLAwareNavLink>
            );
          })}
        </div>
      )}

      {customActions && <div className="mt-2 flex grow-0 items-center gap-2 sm:mt-0">{customActions}</div>}
    </header>
  );
};

