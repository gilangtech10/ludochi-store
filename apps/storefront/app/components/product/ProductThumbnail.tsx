import { Image } from '@app/components/common/images/Image';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

export interface ProductThumbnailProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
}

export const ProductThumbnail: FC<ProductThumbnailProps> = ({ product, className, isTransitioning, ...props }) => {
  const thumbnailImage = (product.images && product.images[0] && product.images[0].url) || product.thumbnail;
  const hoverImage = product.images && product.images[1] && product.images[1].url;

  return (
    <figure
      className={clsx(
        'product-thumbnail',
        'aspect-[4/3] w-full overflow-hidden',
        className,
      )}
      style={{
        backgroundColor: '#1C1714',
        viewTransitionName: isTransitioning ? 'product-thumbnail' : undefined,
      }}
      {...props}
    >
      {/* Hover / secondary image */}
      {hoverImage && (
        <Image
          loading="lazy"
          src={hoverImage}
          alt={product.title || ''}
          className="h-full w-full object-cover object-center absolute inset-0 opacity-0 sepia-aged group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
        />
      )}

      {/* Primary / thumbnail image */}
      {thumbnailImage ? (
        <Image
          loading="lazy"
          src={thumbnailImage}
          alt={product.title || ''}
          className={clsx(
            'h-full w-full object-cover object-center sepia-aged group-hover:scale-105 transition-all duration-700 ease-out',
            { 'group-hover:opacity-0': hoverImage },
          )}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#9C8B7A', textTransform: 'uppercase' }}
        >
          No Image
        </div>
      )}
    </figure>
  );
};
