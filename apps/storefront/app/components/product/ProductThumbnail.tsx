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
        'aspect-[4/3] w-full overflow-hidden bg-[#F5F2EB]',
        className,
      )}
      style={{
        viewTransitionName: isTransitioning ? 'product-thumbnail' : undefined,
      }}
      {...props}
    >
      {hoverImage && (
        <Image
          loading="lazy"
          src={hoverImage}
          alt={product.title}
          className="h-full w-full object-cover object-center opacity-0 transition-all duration-[1.5s] ease-out grayscale-[30%] sepia-[20%] group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
        />
      )}
      {thumbnailImage ? (
        <Image
          loading="lazy"
          src={thumbnailImage}
          alt={product.title}
          className={clsx('h-full w-full object-cover object-center transition-all duration-[1.5s] ease-out grayscale-[30%] sepia-[20%] group-hover:grayscale-0 group-hover:scale-105', {
            'group-hover:opacity-0': hoverImage,
            'group-hover:opacity-100': !hoverImage,
          })}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center object-cover object-center group-hover/product-card:opacity-75">
          No Image
        </div>
      )}
    </figure>
  );
};
