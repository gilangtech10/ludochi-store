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
  const isBestSeller = product.tags?.some((t: any) => t.value?.toLowerCase() === 'best-seller');

  return (
    <article
      className={clsx(
        className,
        'group flex flex-col overflow-hidden h-full rounded-2xl transition-all duration-200 active:scale-[0.97] active:shadow-sm',
      )}
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 12px rgba(61,43,31,0.06)',
        border: '1px solid rgba(240,230,214,0.6)',
      }}
      {...props}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        <ProductThumbnail isTransitioning={isTransitioning} product={product} />

        {/* Badge overlay */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
          {isNew && (
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide"
              style={{ backgroundColor: '#3D2B1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
            >
              BARU
            </span>
          )}
          {isBestSeller && (
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide"
              style={{ backgroundColor: '#C47C3A', color: '#FFFFFF', fontFamily: 'var(--font-label)' }}
            >
              BEST SELLER
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 pt-2.5 flex flex-col gap-1">
        <h3
          className="text-[13px] leading-snug line-clamp-2 min-h-[2.4em]"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#3D2B1F' }}
        >
          {product.title}
        </h3>
        <p
          className="text-[13px] font-bold tracking-tight"
          style={{ color: '#C47C3A', fontFamily: 'var(--font-body)' }}
        >
          <ProductPrice product={product} currencyCode={region?.currency_code || 'idr'} />
        </p>
      </div>
    </article>
  );
};

export default ProductListItem;
