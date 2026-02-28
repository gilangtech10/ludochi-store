import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import type { FC } from 'react';
import { NavLink, useNavigation } from 'react-router';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import { ProductListHeader, type ProductListHeaderProps } from './ProductListHeader';
import { ProductListItem } from './ProductListItem';

export interface ProductListProps extends Partial<ProductListHeaderProps> {
  products?: StoreProduct[];
  className?: string;
}

export const ProductGrid: FC<ProductListProps> = ({
  heading,
  actions,
  products,
  className = 'grid grid-cols-1 gap-y-6 @md:grid-cols-2 gap-x-4 @2xl:!grid-cols-3 @4xl:!grid-cols-4 @4xl:gap-x-4',
}) => {
  const navigation = useNavigation();

  if (navigation.state === 'loading') {
    return (
      <div className="@container">
        {heading && <ProductListHeader heading={heading} actions={actions} />}
        <div className={className}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductGridSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="@container">
      {heading && <ProductListHeader heading={heading} actions={actions} />}

      <div className={className}>
        {products?.map((product) => (
          <NavLink prefetch="viewport" key={product.id} to={`/products/${product.handle}`} className="outline-none" viewTransition>
            {({ isTransitioning }) => <ProductListItem isTransitioning={isTransitioning} product={product} />}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
