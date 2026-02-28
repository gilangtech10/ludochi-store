import { useProductInventory } from '@app/hooks/useProductInventory';
import { StoreProduct } from '@medusajs/types';
import { FC, HTMLAttributes } from 'react';

interface ProductBadgesProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  className?: string;
}

export const ProductBadges: FC<ProductBadgesProps> = ({ product, className }) => {
  const productInventory = useProductInventory(product);
  const isSoldOut = productInventory.averageInventory === 0;

  if (!isSoldOut) return null;

  return (
    <div
      className={className}
      aria-label="Sold Out"
    >
      <span
        className="block py-1 px-3"
        style={{
          fontFamily: 'var(--font-label)',
          fontSize: '0.55rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          backgroundColor: '#8B2635',
          border: '1px solid #6B1A25',
          color: '#E8DFD4',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)',
        }}
      >
        Sold Out
      </span>
    </div>
  );
};
