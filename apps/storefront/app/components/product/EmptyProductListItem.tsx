import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export interface EmptyProductListItemProps extends HTMLAttributes<HTMLElement> {}

export const EmptyProductListItem: React.FC<EmptyProductListItemProps> = ({ className, ...props }) => (
  <article
    className={clsx(className, 'rounded-2xl overflow-hidden animate-pulse')}
    style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}
    {...props}
  >
    <div className="aspect-square w-full" style={{ backgroundColor: '#F0E6D6' }} />
    <div className="p-3 space-y-2">
      <div className="h-3 rounded-full w-3/4" style={{ backgroundColor: '#E2CCB0' }} />
      <div className="h-2.5 rounded-full w-1/2" style={{ backgroundColor: '#E2CCB0' }} />
    </div>
  </article>
);
