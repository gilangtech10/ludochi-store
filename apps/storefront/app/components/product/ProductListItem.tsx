import { useRegion } from '@app/hooks/useRegion';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';
import { ProductBadges } from './ProductBadges';
import { ProductPrice } from './ProductPrice';
import { ProductThumbnail } from './ProductThumbnail';
import { NavLink } from 'react-router';

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
        'academia-card ornate-frame group flex flex-col overflow-hidden h-full',
        'transition-all duration-300',
      )}
      {...props}
    >
      {/* ── Image ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <ProductThumbnail isTransitioning={isTransitioning} product={product} />

        {/* Badge overlay */}
        <div className="absolute top-3 right-3 z-20">
          <ProductBadges product={product} />
          {!product.variants?.every((v) => v.inventory_quantity === 0) && (
            <div
              className="py-1 px-3"
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                backgroundColor: isNew ? '#8B2635' : 'transparent',
                border: `1px solid ${isNew ? '#8B2635' : '#C9A962'}`,
                color: isNew ? '#E8DFD4' : '#C9A962',
              }}
            >
              {isNew ? 'New Edition' : 'Classic'}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <span className="academia-label mb-2 block">Entry</span>
          <h4
            className="text-xl md:text-2xl mb-3 leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-[#C9A962]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
          >
            {product.title}
          </h4>
          {product.description && (
            <p
              className="italic text-sm mb-4 line-clamp-2 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
            >
              {product.description}
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#4A3F35]">
          <div className="flex flex-col">
            <span className="academia-label mb-1">Offered At</span>
            <div className="text-lg" style={{ fontFamily: 'var(--font-display)', color: '#E8DFD4' }}>
              <ProductPrice product={product} currencyCode={region.currency_code} />
            </div>
          </div>

          <span
            className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#D4B872]"
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C9A962',
            }}
          >
            View Entry
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductListItem;
