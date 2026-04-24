import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { motion, Variants } from 'framer-motion';
import type { FC } from 'react';
import { NavLink, useNavigation } from 'react-router';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import { ProductListHeader, type ProductListHeaderProps } from './ProductListHeader';
import { ProductListItem } from './ProductListItem';
import { EmptyProductListItem } from './EmptyProductListItem';

export interface ProductListProps extends Partial<ProductListHeaderProps> {
  products?: StoreProduct[];
  className?: string;
  disableAnimation?: boolean;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export const ProductGrid: FC<ProductListProps> = ({
  heading,
  actions,
  products,
  className = 'grid grid-cols-2 gap-3 @md:grid-cols-3 @lg:grid-cols-4 md:gap-4',
  disableAnimation = false,
}) => {
  const navigation = useNavigation();

  if (navigation.state === 'loading') {
    return (
      <div className="@container">
        {heading && <ProductListHeader heading={heading} actions={actions} />}
        <div className={className}>
          {Array.from({ length: 4 }).map((_, index) => (
            <EmptyProductListItem key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="@container">
      {heading && <ProductListHeader heading={heading} actions={actions} />}

      {disableAnimation ? (
        <div className={className}>
          {products?.map((product) => (
            <NavLink prefetch="viewport" key={product.id} to={`/products/${product.handle}`} className="outline-none" viewTransition>
              {({ isTransitioning }) => <ProductListItem isTransitioning={isTransitioning} product={product} />}
            </NavLink>
          ))}
        </div>
      ) : (
        <motion.div 
          className={className}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {products?.map((product) => (
            <motion.div variants={fadeUpVariant} key={product.id}>
              <NavLink prefetch="viewport" to={`/products/${product.handle}`} className="outline-none" viewTransition>
                {({ isTransitioning }) => <ProductListItem isTransitioning={isTransitioning} product={product} />}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;
