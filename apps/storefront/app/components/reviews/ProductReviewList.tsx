import { LightboxGallery } from '@app/components/common/images/LightboxGallery';
import { StoreProductReview } from '@lambdacurry/medusa-plugins-sdk';
import { formatDate } from '@libs/util';
import { type FC, useState } from 'react';
import { ReviewImageThumbnailRow } from './ReviewImageThumbnailRow';
import { StarRating } from './StarRating';

export interface ProductReviewListProps {
  productReviews?: StoreProductReview[];
  className?: string;
}

export const ProductReviewList: FC<ProductReviewListProps> = ({ productReviews }) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [currentGalleryImages, setCurrentGalleryImages] = useState<{ url: string; alt?: string; name?: string }[]>([]);

  const handleImageClick = (reviewImages: { url: string; alt?: string; name?: string }[], imageIndex: number) => {
    setCurrentGalleryImages(reviewImages);
    setLightboxIndex(imageIndex);
  };

  return (
    <div>
      {productReviews && productReviews.length > 0 && (
        <div className="-my-12">
          {productReviews.map((review) => {
            const galleryImages = (review.images || []).map((image) => ({
              url: image.url,
              alt: "Reader's review image",
              name: "Reader's review image",
            }));

            return (
              <div
                key={review.id}
                className="py-9"
                style={{ borderBottom: '1px solid rgba(74,63,53,0.5)' }}
              >
                {/* Reviewer header */}
                <div className="flex items-center justify-between gap-4">
                  <h3
                    className="mr-2"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4', fontSize: '1.05rem' }}
                  >
                    {review.name ?? 'Anonymous Reader'}
                  </h3>
                  <div className="flex items-center pb-1">
                    <StarRating value={review.rating ?? 0} readOnly />
                  </div>
                </div>

                <time
                  className="block mt-1 italic"
                  dateTime={review.created_at}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#9C8B7A' }}
                >
                  {formatDate(new Date(review.created_at))}
                </time>

                <div
                  className="mt-4 space-y-4 italic leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(232,223,212,0.75)' }}
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />

                {galleryImages.length > 0 && (
                  <ReviewImageThumbnailRow
                    galleryImages={galleryImages}
                    onClick={(imageIndex) => handleImageClick(galleryImages, imageIndex)}
                  />
                )}

                {/* Store response */}
                {review.response?.content && (
                  <div
                    className="mt-5 p-4"
                    style={{ backgroundColor: '#251E19', border: '1px solid #4A3F35' }}
                  >
                    <div className="flex items-center gap-3">
                      <h4
                        className="academia-label"
                      >
                        LuDo-Chi's Reply
                      </h4>
                      {review.response.created_at && (
                        <time
                          className="italic"
                          dateTime={String(review.response.created_at)}
                          style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#9C8B7A' }}
                        >
                          {formatDate(new Date(review.response.created_at))}
                        </time>
                      )}
                    </div>
                    <div
                      className="mt-2 italic leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(232,223,212,0.7)' }}
                      dangerouslySetInnerHTML={{ __html: review.response.content }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <LightboxGallery
        images={currentGalleryImages.map(({ url, ...image }) => ({ ...image, src: url }))}
        lightBoxIndex={lightboxIndex}
        setLightBoxIndex={setLightboxIndex}
      />
    </div>
  );
};
