import { useRegion } from '@app/hooks/useRegion';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';
import { ProductPrice } from './ProductPrice';
import { ProductThumbnail } from './ProductThumbnail';

export interface ProductListItemProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
}

export const ProductListItem: FC<ProductListItemProps> = ({ product, className, isTransitioning, ...props }) => {
  const { region } = useRegion();
  const isNew = product.tags?.some((t: any) => t.value?.toLowerCase() === 'new');

  return (
    <article
      className={clsx(
        className,
        'group flex flex-col overflow-hidden h-full rounded-2xl transition-transform duration-150 active:scale-95',
      )}
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}
      {...props}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        <ProductThumbnail isTransitioning={isTransitioning} product={product} />

        {/* Badge overlay */}
        {isNew && (
          <span
            className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: '#6B3A1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
          >
            Baru
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-0.5">
        <p
          className="text-sm leading-snug line-clamp-1"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
        >
          {product.title}
        </p>
        <p
          className="text-xs font-semibold"
          style={{ color: '#C47C3A', fontFamily: 'var(--font-body)' }}
        >
          <ProductPrice product={product} currencyCode={region?.currency_code || 'idr'} />
        </p>
      </div>
    </article>
  );
};

export default ProductListItem;
