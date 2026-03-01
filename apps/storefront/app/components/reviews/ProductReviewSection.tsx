import { FC } from 'react';
import { useRouteLoaderData } from 'react-router';
import { ProductPageLoaderData } from '../../routes/products.$productHandle';
import { ProductReviewListWithPagination } from './ReviewListWithPagination';
import ProductReviewSummary from './ReviewSummary';
import { motion, Variants } from 'framer-motion';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

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
      <motion.div 
        className="container mx-auto px-8 py-16 md:py-24"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Section header */}
        <motion.div variants={fadeUpVariant} className="text-center mb-14">
          <span className="academia-label mb-4 block">Volume IV</span>
          <h2
            className="text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
          >
            Reader <em style={{ color: '#C9A962' }}>Testimonials</em>
          </h2>
          <div className="ornate-divider w-32 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-12">
          <motion.div variants={fadeUpVariant} className="col-span-12 lg:col-span-4">
            <ProductReviewSummary
              stats={productReviewStats?.product_review_stats[0]}
              count={productReviews.count}
            />
          </motion.div>
          <motion.div variants={fadeUpVariant} className="col-span-12 my-16 lg:col-span-8 lg:col-start-6 lg:mt-0">
            <ProductReviewListWithPagination
            productReviews={productReviews.product_reviews}
            context={`products/${product.handle}`}
            paginationConfig={{
              limit: productReviews.limit,
              offset: productReviews.offset,
              count: productReviews.count,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
    </section>
  );
};
