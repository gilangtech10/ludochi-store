import StarIcon from '@heroicons/react/24/solid/StarIcon';
import { StoreProductReviewStats } from '@lambdacurry/medusa-plugins-sdk';
import clsx from 'clsx';
import type { FC } from 'react';
import { StarRating } from './StarRating';

export interface ProductReviewSummaryProps {
  stats?: StoreProductReviewStats;
  count?: number;
  className?: string;
}

const ReviewRating: FC<{ rating: number; rating_count: number; count: number }> = ({
  rating,
  rating_count,
  count,
}) => {
  const pct = count > 0 ? Math.round((rating_count / count) * 100) : 0;
  return (
    <div key={rating} className="flex items-center text-sm gap-2">
      <p
        className="w-3 shrink-0"
        style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#9C8B7A' }}
      >
        {rating}
      </p>
      <div aria-hidden="true" className="flex flex-1 items-center gap-1">
        <StarIcon
          className={clsx('h-4 w-4 shrink-0', count > 0 ? 'text-[#C9A962]' : 'opacity-30')}
          style={{ color: count > 0 ? '#C9A962' : undefined }}
        />
        <div className="relative flex-1 h-2" style={{ backgroundColor: 'rgba(74,63,53,0.6)' }}>
          {count > 0 && (
            <div
              className="absolute inset-y-0"
              style={{ width: `${pct}%`, backgroundColor: '#C9A962', opacity: 0.7 }}
            />
          )}
        </div>
      </div>
      <dd
        className="w-8 text-right tabular-nums shrink-0"
        style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#9C8B7A' }}
      >
        {pct}%
      </dd>
    </div>
  );
};

export const ProductReviewSummary: FC<ProductReviewSummaryProps> = ({ stats, count = 0, className }) => {
  return (
    <div className={className}>
      {stats && (
        <>
          <h2
            className="text-2xl tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
          >
            Reader Reviews
          </h2>

          <div className="mt-3 flex items-center gap-3">
            <StarRating value={stats.average_rating as number} readOnly />
            <p
              className="italic"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#9C8B7A' }}
            >
              Based on {count} review{count > 1 && 's'}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Rating distribution</h3>
            <dl className="space-y-2.5">
              <ReviewRating rating={5} rating_count={stats.rating_count_5} count={count} />
              <ReviewRating rating={4} rating_count={stats.rating_count_4} count={count} />
              <ReviewRating rating={3} rating_count={stats.rating_count_3} count={count} />
              <ReviewRating rating={2} rating_count={stats.rating_count_2} count={count} />
              <ReviewRating rating={1} rating_count={stats.rating_count_1} count={count} />
            </dl>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviewSummary;
