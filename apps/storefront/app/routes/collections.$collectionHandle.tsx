import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { fetchCollections } from '@libs/util/server/data/collections.server';
import { fetchProducts } from '@libs/util/server/products.server';
import clsx from 'clsx';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { NavLink, useLoaderData } from 'react-router';
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const handle = params.collectionHandle as string;

  const { collections } = await fetchCollections();

  const collection = collections?.find((collection) => collection.handle === handle);

  if (!collection) throw redirect('/products');

  const { products, count, limit, offset } = await fetchProducts(request, {
    collection_id: collection.id,
  });

  return { products, count, limit, offset, collections, collection };
};

export type ProductCollectionRouteLoader = typeof loader;

const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function ProductCollectionRoute() {
  const data = useLoaderData<ProductCollectionRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset, collections, collection } = data;

  return (
    <div
      className="min-h-screen relative selection:bg-[#C9A962] selection:text-[#1C1714]"
      style={{ backgroundColor: '#1C1714', color: '#E8DFD4' }}
    >
      {/* Atmospheric overlays */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
        style={{ backgroundImage: PAPER_TEXTURE, opacity: 0.03 }}
      />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 vignette-overlay" />

      {/* ── Page Header ── */}
      <div
        className="w-full border-b border-[#4A3F35] text-center relative overflow-hidden"
        style={{
          paddingTop: 'calc(var(--mkt-header-height-desktop) + 4rem)',
          paddingBottom: '4rem',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, transparent 0%, #4A3F35 30%, #4A3F35 70%, transparent 100%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, transparent 0%, #4A3F35 30%, #4A3F35 70%, transparent 100%)' }}
        />

        <motion.div 
          className="max-w-3xl mx-auto px-6 relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariant} className="academia-label-row mb-6 max-w-[10rem] mx-auto">Volume · Collection</motion.div>

          <motion.h1
            variants={fadeUpVariant}
            className="text-5xl md:text-7xl italic leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
          >
            {collection.title}
          </motion.h1>

          <motion.div variants={fadeUpVariant} className="ornate-divider w-48 mx-auto mb-4" />

          {count > 0 && (
            <motion.p
              variants={fadeUpVariant}
              style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9C8B7A' }}
            >
              {count} {count === 1 ? 'Entry' : 'Entries'} in this Volume
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* ── Collection Tabs ── */}
      {collections.length > 1 && (
        <motion.div 
          className="flex justify-center pt-10 pb-2 relative z-10"
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
        >
          <div
            className="inline-flex gap-1 p-1"
            style={{ backgroundColor: '#251E19', border: '1px solid #4A3F35' }}
          >
            {collections.map((col) => (
              <NavLink
                to={`/collections/${col.handle}`}
                key={col.id}
                prefetch="viewport"
                className={({ isActive }) =>
                  clsx(
                    'px-5 py-2.5 transition-all duration-300',
                    isActive
                      ? 'text-[#1C1714] bg-[#C9A962]'
                      : 'text-[#9C8B7A] hover:text-[#E8DFD4]',
                  )
                }
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic' }}
              >
                {col.title}
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Product Grid ── */}
      <Container className="relative z-10 py-16 md:py-20">
        <ProductListWithPagination
          products={products}
          paginationConfig={{ count, offset, limit }}
          context="products"
        />
      </Container>
    </div>
  );
}
