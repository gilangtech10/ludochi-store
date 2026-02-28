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
            <>
              <span className="academia-label block">— Curated Selection —</span>
              <h2
                className="text-3xl md:text-4xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic', color: '#E8DFD4' }}
              >
                {heading || children}
              </h2>
            </>
          )}
          {text && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.65)', fontStyle: 'italic' }}>
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
                style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A962' }}
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

