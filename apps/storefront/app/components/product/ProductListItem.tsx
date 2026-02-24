import { useRegion } from '@app/hooks/useRegion';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import type { FC, HTMLAttributes } from 'react';
import { ProductBadges } from './ProductBadges';
import { ProductPrice } from './ProductPrice';
import { ProductThumbnail } from './ProductThumbnail';

export interface ProductListItemProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
}

export const ProductListItem: FC<ProductListItemProps> = ({ product, className, isTransitioning, ...props }) => {
  const { region } = useRegion();

  return (
    <article className={clsx(className, 'group flex flex-col bg-transparent border border-[#2C1E16] overflow-hidden transition-all duration-500 hover:bg-[#2C1E16] hover:text-[#F5F2EB] text-[#2C1E16] h-full')} {...props}>
      <div className="relative w-full overflow-hidden border-b border-[#2C1E16] group-hover:border-[#B0894A]">
        <ProductBadges className="absolute top-0 right-0 z-20 bg-[#F5F2EB] text-[#2C1E16] border-b border-l border-[#2C1E16] group-hover:bg-[#B0894A] group-hover:text-[#F5F2EB] group-hover:border-[#B0894A] transition-colors duration-500 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest flex gap-2" product={product} />
        <ProductThumbnail isTransitioning={isTransitioning} product={product} />
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative z-20">
        <div>
          <h4 className="text-xl md:text-2xl font-display font-medium mb-3 leading-tight group-hover:text-[#B0894A] transition-colors duration-300 line-clamp-2">
            {product.title}
          </h4>
          {product.description && (
            <p className="text-current opacity-80 font-body italic text-sm mb-6 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#2C1E16] group-hover:border-[#B0894A]/30">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-60">Mahar</span>
            <div className="text-lg font-display font-medium flex items-center">
              <ProductPrice product={product} currencyCode={region.currency_code} />
            </div>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold hover:text-[#B0894A] transition-colors flex items-center gap-2">
            Lihat
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};
