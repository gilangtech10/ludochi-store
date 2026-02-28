import { FC } from 'react';
import { useRouteLoaderData } from 'react-router';
import { ProductPageLoaderData } from '../../routes/products.$productHandle';
import { ProductReviewListWithPagination } from './ReviewListWithPagination';
import ProductReviewSummary from './ReviewSummary';

export const ProductReviewSection: FC = () => {
  const data = useRouteLoaderData<ProductPageLoaderData>('routes/products.$productHandle');

  if (!data) return null;

  const { product, productReviews, productReviewStats } = data;

  if (!productReviews.count || productReviewStats.count < 1) return null;

  return (
    <section
      id="reviews"
      className="relative"
      style={{ backgroundColor: '#1A1512', borderTop: '1px solid #4A3F35' }}
    >
      <div className="container mx-auto px-8 py-16 md:py-24">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="academia-label mb-4 block">Volume IV</span>
          <h2
            className="text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
          >
            Reader <em style={{ color: '#C9A962' }}>Testimonials</em>
          </h2>
          <div className="ornate-divider w-32 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-12">
          <ProductReviewSummary
            className="col-span-12 lg:col-span-4"
            stats={productReviewStats?.product_review_stats[0]}
            count={productReviews.count}
          />
          <ProductReviewListWithPagination
            className="col-span-12 my-16 lg:col-span-8 lg:col-start-6 lg:mt-0"
            productReviews={productReviews.product_reviews}
            context={`products/${product.handle}`}
            paginationConfig={{
              limit: productReviews.limit,
              offset: productReviews.offset,
              count: productReviews.count,
            }}
          />
        </div>
      </div>
    </section>
  );
};
