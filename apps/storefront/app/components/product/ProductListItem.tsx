import { useRegion } from '@app/hooks/useRegion';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import { StoreProduct } from '@medusajs/types';
import { PlusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { FC, HTMLAttributes, useEffect, useMemo } from 'react';
import { useFetcher, Link } from 'react-router';
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

  const fetcher = useFetcher<any>({ key: FetcherKeys.cart.createLineItem });
  const isAdding = ['submitting', 'loading'].includes(fetcher.state);
  const justAdded = fetcher.state === 'idle' && fetcher.data?.cart && !fetcher.data?.errors;

  // Determine if product has options that require selection
  const hasOptions = (product.options?.length ?? 0) > 0;

  // Build default options for single-variant products
  const defaultOptions = useMemo(() => {
    if (hasOptions) return {};
    const first = product.variants?.[0];
    if (first?.options) {
      return first.options.reduce((acc, o) => {
        if (o.option_id && o.value) acc[o.option_id] = o.value;
        return acc;
      }, {} as Record<string, string>);
    }
    return {};
  }, [product, hasOptions]);

  const handleQuickAdd = () => {
    if (hasOptions) return; // Should not reach here because we render Link instead
    const formData = new FormData();
    formData.append('productId', product.id!);
    formData.append('quantity', '1');
    Object.entries(defaultOptions).forEach(([k, v]) => {
      formData.append(`options[${k}]`, v);
    });
    fetcher.submit(formData, {
      method: 'post',
      action: '/api/cart/line-items/create',
    });
  };

  // Reset added state after a delay
  useEffect(() => {
    if (justAdded) {
      const t = setTimeout(() => {
        // fetcher will naturally reset on next interaction
      }, 1500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [justAdded]);

  return (
    <article
      className={clsx(
        className,
        'group flex flex-col overflow-hidden h-full rounded-2xl transition-all duration-200',
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

        {/* Quick add button - bottom right overlay */}
        {hasOptions ? (
          <Link
            to={`/products/${product.handle}`}
            prefetch="viewport"
            className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 hover:shadow-md"
            style={{
              backgroundColor: '#6B3A1F',
              boxShadow: '0 2px 8px rgba(107,58,31,0.3)',
            }}
            aria-label="Pilih variant"
            viewTransition
          >
            <PlusIcon className="w-4 h-4" style={{ color: '#FFFAF4' }} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-70"
            style={{
              backgroundColor: justAdded ? '#3D2B1F' : '#6B3A1F',
              boxShadow: '0 2px 8px rgba(107,58,31,0.3)',
            }}
            aria-label="Tambah ke keranjang"
          >
            {isAdding ? (
              <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-t-transparent animate-spin" style={{ borderColor: '#FFFAF4', borderTopColor: 'transparent' }} />
            ) : justAdded ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#FFFAF4" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <PlusIcon className="w-4 h-4" style={{ color: '#FFFAF4' }} />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 pt-2.5 flex flex-col gap-1">
        <h3
          className="text-[13px] leading-snug line-clamp-2 min-h-[2.4em]"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#3D2B1F' }}
        >
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <p
            className="text-[13px] font-bold tracking-tight"
            style={{ color: '#C47C3A', fontFamily: 'var(--font-body)' }}
          >
            <ProductPrice product={product} currencyCode={region?.currency_code || 'idr'} />
          </p>
          {justAdded && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: '#3D2B1F',
                color: '#FFFAF4',
                fontFamily: 'var(--font-label)',
              }}
            >
              Ditambahkan
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductListItem;
