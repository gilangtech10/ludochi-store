import { Container } from '@app/components/common/container';
import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { fetchProducts } from '@libs/util/server/products.server';
import { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link } from 'react-router';
import { motion, Variants } from 'framer-motion';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { products, count, limit, offset } = await fetchProducts(request, {});
  return { products, count, limit, offset };
};

export type ProductsIndexRouteLoader = typeof loader;

// Paper texture SVG (matches homepage)
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

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

export default function ProductsIndexRoute() {
  const data = useLoaderData<ProductsIndexRouteLoader>();

  if (!data) return null;

  const { products, count, limit, offset } = data;

  return (
    <div
      className="w-full min-h-screen selection:bg-[#C9A962] selection:text-[#1C1714] relative"
      style={{ backgroundColor: '#1C1714', color: '#E8DFD4' }}
    >
      {/* ── Global Atmospheric Overlays ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
        style={{ backgroundImage: PAPER_TEXTURE, opacity: 0.03 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 vignette-overlay"
      />

      {/* ── Page Header ── */}
      <div
        className="relative w-full border-b border-[#4A3F35] overflow-hidden"
        style={{
          paddingTop: 'calc(var(--mkt-header-height-desktop) + 4rem)',
          paddingBottom: '4rem',
          backgroundColor: '#1C1714',
        }}
      >
        {/* Subtle side rule lines */}
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
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb */}
          <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-3 mb-8">
            <Link
              to="/"
              className="transition-colors duration-200 hover:text-[#C9A962]"
              style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B7A' }}
            >
              Home
            </Link>
            <span style={{ color: '#4A3F35' }}>·</span>
            <span
              style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A962' }}
            >
              The Catalogue
            </span>
          </motion.div>

          {/* Overline label */}
          <motion.div variants={fadeUpVariant} className="academia-label-row mb-6 max-w-xs mx-auto">
            The Complete Catalogue
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={fadeUpVariant}
            className="text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
          >
            Our <em style={{ color: '#C9A962' }}>Entire</em> Collection
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="text-lg italic leading-relaxed max-w-lg mx-auto mb-8"
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.7)' }}
          >
            Every recipe, every craft, every flavour — all catalogued for your
            scholarly perusal.
          </motion.p>

          {/* Ornate divider */}
          <motion.div variants={fadeUpVariant} className="ornate-divider mx-auto w-48 mb-4" />

          {/* Entry count */}
          {count > 0 && (
            <motion.p
              variants={fadeUpVariant}
              style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9C8B7A' }}
            >
              {count} {count === 1 ? 'Entry' : 'Entries'} Catalogued
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* ── Product Grid ── */}
      <Container className="relative z-10 py-16 md:py-24">
        <ProductListWithPagination
          products={products}
          paginationConfig={{ count, offset, limit }}
          context="products"
        />
      </Container>
    </div>
  );
}
