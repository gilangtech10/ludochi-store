import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { motion, Variants } from 'framer-motion';
import type { FC } from 'react';
import { NavLink, useNavigation } from 'react-router';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import { ProductListHeader, type ProductListHeaderProps } from './ProductListHeader';
import { ProductListItem } from './ProductListItem';

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
  className = 'grid grid-cols-1 gap-y-6 @md:grid-cols-2 gap-x-4 @2xl:!grid-cols-3 @4xl:!grid-cols-4 @4xl:gap-x-4',
  disableAnimation = false,
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
