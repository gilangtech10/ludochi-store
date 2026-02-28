import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { type FC, memo } from 'react';
import { NavLink } from 'react-router';
import { ProductCarouselSkeleton } from './ProductCarouselSkeleton';
import type { ProductListItemProps } from './ProductListItem';
import { ProductListItem } from './ProductListItem';

export interface ProductCarouselProps {
  products?: StoreProduct[];
  className?: string;
  itemClassName?: string;
}

export const ProductCarousel: FC<ProductCarouselProps> = memo(({ products, className, itemClassName }) => {
  if (!products) {
    return <ProductCarouselSkeleton length={4} />;
  }

  return (
    <div className="w-full overflow-x-auto snap-x snap-mandatory flex gap-4 md:gap-6 pb-8 hide-scrollbar">
      {products.map((product) => (
        <div
          key={product.id}
          className="snap-start flex-none w-[65vw] sm:w-[35vw] md:w-[25vw] lg:w-[20vw] xl:w-[16vw]"
        >
          <NavLink prefetch="viewport" to={`/products/${product.handle}`} className="outline-none block h-full" viewTransition>
            {({ isTransitioning }) => <ProductListItem isTransitioning={isTransitioning} product={product} />}
          </NavLink>
        </div>
      ))}
    </div>
  );
});
ProductCarousel.displayName = 'ProductCarousel';

export default ProductCarousel;
