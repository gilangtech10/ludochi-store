import { ScrollArrowButtons } from '@app/components/common/buttons/ScrollArrowButtons';
import { Image } from '@app/components/common/images/Image';
import { LightboxGallery } from '@app/components/common/images/LightboxGallery';
import { useScrollArrows } from '@app/hooks/useScrollArrows';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { FC, memo, useState } from 'react';

export interface ProductGalleryImage {
  id: string;
  url: string;
  alt?: string;
  name?: string;
}

export interface ProductImageGalleryProps {
  product: StoreProduct;
}

const GalleryImagesRow: FC<{ galleryImages: ProductGalleryImage[] }> = memo(({ galleryImages }) => {
  return (
    <>
      {galleryImages.map((image, imageIndex) => (
        <Tab
          key={image.id}
          className="relative mb-0 mr-2 inline-block h-16 w-16 cursor-pointer snap-start whitespace-nowrap text-sm last:mb-0 last:mr-0 focus:outline-none focus:ring-0 lg:mb-2 lg:mr-0 lg:whitespace-normal overflow-hidden"
          style={{ backgroundColor: '#1C1714', border: '1px solid #4A3F35' }}
        >
          {({ selected }) => (
            <>
              <span className="sr-only">{image.name}</span>
              <span className="absolute inset-0 overflow-hidden">
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.alt || 'tab for image gallery'}
                  className="h-full w-full object-cover object-center sepia-aged transition-all duration-500"
                />
              </span>
              {/* Active border — brass */}
              <span
                className={clsx('pointer-events-none absolute inset-0 transition-all duration-200', {
                  'border-2 border-[#C9A962]': selected,
                  'border border-[#4A3F35]': !selected,
                })}
                aria-hidden="true"
              />
            </>
          )}
        </Tab>
      ))}
    </>
  );
});

export const ProductImageGallery: FC<ProductImageGalleryProps> = ({ product }) => {
  const { images: productImages = [], thumbnail } = product;
  const images = productImages ?? [];
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const { scrollableDivRef, showStartArrow, showEndArrow, handleArrowClick } = useScrollArrows({
    buffer: 50,
    resetOnDepChange: [product],
  });

  const gallery: ProductGalleryImage[] =
    images?.length < 1 && thumbnail
      ? [{ id: 'thumbnail', name: `Thumbnail for ${product.title}`, url: thumbnail, alt: product.description || product.title }]
      : (images as ProductGalleryImage[]);

  return (
    <TabGroup as="div" className="flex flex-col-reverse gap-4 lg:flex-row">
      <h2 className="sr-only">Images</h2>

      {/* ── Thumbnail strip ── */}
      {gallery.length > 1 && (
        <div className="flex-grow-1 relative mx-auto mb-4 block h-8 w-full lg:mb-0 lg:h-auto lg:max-w-[68px]">
          <TabList
            ref={scrollableDivRef}
            className="absolute bottom-0 left-0 right-0 top-0 h-20 snap-both snap-proximity overflow-x-auto whitespace-nowrap pb-3 lg:-right-4 lg:bottom-0 lg:h-auto lg:overflow-y-auto lg:overflow-x-hidden lg:whitespace-normal lg:px-0 lg:py-0"
          >
            <GalleryImagesRow galleryImages={gallery} />
          </TabList>

          <ScrollArrowButtons
            className="hidden lg:-ml-[18px] lg:flex"
            orientation="vertical"
            showStartArrow={showStartArrow}
            showEndArrow={showEndArrow}
            handleArrowClick={handleArrowClick}
          />
          <ScrollArrowButtons
            className="flex lg:-ml-4 lg:hidden"
            showStartArrow={showStartArrow}
            showEndArrow={showEndArrow}
            handleArrowClick={handleArrowClick}
          />
        </div>
      )}

      {/* ── Main image panel ── */}
      <TabPanels className="flex-grow-1 w-full">
        <div className="aspect-1 relative" style={{ backgroundColor: '#1C1714' }}>
          {gallery.length > 0 ? (
            gallery.map((image, imageIndex) => (
              <TabPanel
                key={image.id}
                className="group relative h-full w-full cursor-pointer overflow-hidden"
                onClick={() => setLightboxIndex(imageIndex)}
              >
                <Image
                  key={image.id}
                  style={{ viewTransitionName: 'product-thumbnail' }}
                  src={image.url}
                  alt={image.alt || 'selected image for product'}
                  className="absolute h-full w-full object-cover object-center sepia-aged group-hover:scale-[1.02] transition-all duration-700 ease-out"
                />
                {/* Zoom button */}
                <div
                  className="absolute right-4 top-4 flex items-center justify-center p-2 opacity-0 transition-all duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: '#251E19', border: '1px solid #C9A962' }}
                >
                  <MagnifyingGlassPlusIcon className="h-5 w-5" style={{ color: '#C9A962' }} aria-hidden="true" />
                </div>

                {/* Subtle vignette on image */}
                <div className="absolute inset-0 pointer-events-none vignette-overlay opacity-30" aria-hidden="true" />
              </TabPanel>
            ))
          ) : (
            <div
              className="absolute flex h-full w-full items-center justify-center border border-[#4A3F35] italic"
              style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
            >
              No Image Available
            </div>
          )}
        </div>
      </TabPanels>

      <LightboxGallery
        images={gallery.map((image) => ({ src: image.url, alt: image.alt || 'Product image' }))}
        lightBoxIndex={lightboxIndex}
        setLightBoxIndex={setLightboxIndex}
      />
    </TabGroup>
  );
};
