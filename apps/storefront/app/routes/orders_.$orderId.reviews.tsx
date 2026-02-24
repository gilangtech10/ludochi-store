import { ButtonLink } from '@app/components/common/buttons';
import { Container } from '@app/components/common/container';
import { ProductReviewComponent } from '@app/components/reviews/ProductReviewComponent';
import { formatDate } from '@libs/util';
import { sdk } from '@libs/util/server/client.server';
import { fetchProductReviews } from '@libs/util/server/data/product-reviews.server';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { Link, useLoaderData } from 'react-router';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { order } = await sdk.store.order.retrieve(params.orderId || '', {});

  if (!order) throw redirect('/');

  const { product_reviews } = await fetchProductReviews({ order_id: order.id }, { forceFresh: true });

  return { order, product_reviews };
};

export default function OrderReviewsRoute() {
  const { order, product_reviews } = useLoaderData<typeof loader>();

  const fulfilledItems = order.items || [];
  const uniqueItems: { [key: string]: any } = {};

  for (const item of fulfilledItems) {
    uniqueItems[item.product_id as string] = item;
  }

  return (
    <section className="min-h-screen bg-[#F5F2EB] text-[#2C1E16] selection:bg-[#B0894A] selection:text-[#F5F2EB] relative pt-12 pb-24">
      {/* Global Paper Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E")' }}></div>

      <Container className="!max-w-3xl pb-16 relative z-10">
        <div className="rounded-none border-2 border-[#2C1E16] bg-[#F5F2EB]/50 backdrop-blur-sm shadow-none">
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-4 border-b border-[#2C1E16]/30 p-4">
              <dl className="mr-4 flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-6">
                <div>
                  <dt className="text-[10px] uppercase font-bold tracking-widest text-[#B0894A]">Pesanan</dt>
                  <dd className="mt-1 font-display text-2xl italic text-[#2C1E16]">#{order.display_id}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-bold tracking-widest text-[#B0894A]">Tanggal Pemesanan</dt>
                  <dd className="mt-1 font-display text-2xl italic text-[#2C1E16]">
                    <time dateTime={order.created_at as string}>
                      {formatDate(new Date(order.created_at as string))}
                    </time>
                  </dd>
                </div>
              </dl>
              <div className="flex-auto"></div>
            </div>

            <ul role="list" className="mt-4 divide-y divide-[#2C1E16]/20 text-sm font-bold text-[#2C1E16]">
              {Object.values(uniqueItems)?.map((item) => {
                const review = product_reviews
                  ? product_reviews.find((review) => review.product_id === item.variant.product_id)
                  : undefined;

                return (
                  <li key={item.id}>
                    <ProductReviewComponent orderId={order.id} lineItem={item} productReview={review} />
                  </li>
                );
              })}
            </ul>

            <div className="mt-16 border-t border-[#2C1E16]/30 pt-10 text-center">
              <Link to="/products">
                <ButtonLink className="group relative !h-12 w-full md:w-auto !px-12 !text-base font-display italic tracking-wide !bg-[#2C1E16] text-[#F5F2EB] !border !border-[#2C1E16] !rounded-none hover:!bg-[#F5F2EB] hover:!text-[#2C1E16] cursor-pointer transition-all duration-500 overflow-hidden inline-flex items-center justify-center">
                  <div className="absolute inset-0 border border-[#B0894A] m-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  Lanjut Berbelanja
                  <span aria-hidden="true" className="ml-2"> &rarr;</span>
                </ButtonLink>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
