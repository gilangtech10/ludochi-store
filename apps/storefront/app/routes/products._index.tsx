import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { fetchProducts } from '@libs/util/server/products.server';
import { LoaderFunctionArgs } from 'react-router';
import { Form, useLoaderData, Link, useLocation, useNavigation } from 'react-router';
import { motion, Variants } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { MetaFunction } from 'react-router';
import { useEffect, useRef } from 'react';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const q = data?.q;
  return [{ title: q ? `Pencarian "${q}" — LuDo-Chi` : 'Menu — LuDo-Chi' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url    = new URL(request.url);
  const q      = url.searchParams.get('q')?.trim() || undefined;
  const page   = Number(url.searchParams.get('page') ?? 1);
  const limit  = 12;
  const offset = (page - 1) * limit;

  const { products, count } = await fetchProducts(request, { q, limit, offset });
  return { products, count, limit, offset, q: q ?? null };
};

export type ProductsIndexRouteLoader = typeof loader;

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const CATEGORIES = [
  { label: 'Semua',   href: '/products' },
  { label: 'Donat',   href: '/categories/donut' },
  { label: 'Mochi',   href: '/categories/mochi' },
  { label: 'Minuman', href: '/categories/drinks' },
  { label: 'Bundle',  href: '/categories/bundle' },
];

export default function ProductsIndexRoute() {
  const { products, count, limit, offset, q } = useLoaderData<ProductsIndexRouteLoader>();
  const location   = useLocation();
  const navigation = useNavigation();
  const inputRef   = useRef<HTMLInputElement>(null);

  const isSearching = navigation.state === 'loading' &&
    !!navigation.location?.search?.includes('q=');

  // Sync input value when navigating back/forward
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = q ?? '';
  }, [q]);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFAF4', color: '#3D2B1F' }}>

      {/* ── Page Header ── */}
      <section
        className="relative overflow-hidden px-5 pt-10 pb-6"
        style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}
      >
        {/* Decorative circles */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#E8D5B0' }} />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#E8D5B0' }} />

        <motion.div variants={stagger} initial="hidden" animate="visible" className="relative">
          <motion.p
            variants={fadeUp}
            className="text-[10px] tracking-[0.25em] uppercase mb-2"
            style={{ color: 'rgba(232,213,176,0.55)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
          >
            ドーナツと餅パン
          </motion.p>

          <motion.div variants={fadeUp} className="mb-4">
            <h1 className="text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#FFFAF4' }}>
              {q ? `Hasil untuk "${q}"` : 'Menu Kami'}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,250,244,0.5)', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              {count > 0
                ? `${count} produk ditemukan`
                : q ? 'Tidak ada produk yang cocok' : 'Jelajahi semua menu'}
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div variants={fadeUp}>
            <Form method="get" action="/products" className="relative">
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{ backgroundColor: 'rgba(255,250,244,0.12)', border: '1.5px solid rgba(255,250,244,0.2)' }}
              >
                {isSearching
                  ? <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0" style={{ borderColor: 'rgba(232,213,176,0.6)', borderTopColor: 'transparent' }} />
                  : <MagnifyingGlassIcon className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(232,213,176,0.6)' }} />
                }
                <input
                  ref={inputRef}
                  name="q"
                  type="search"
                  defaultValue={q ?? ''}
                  placeholder="Cari donat, mochi, minuman…"
                  autoComplete="off"
                  className="flex-1 bg-transparent outline-none text-sm min-w-0"
                  style={{ color: '#FFFAF4', fontFamily: 'var(--font-body)', fontWeight: 300 }}
                />
                {q && (
                  <Link
                    to="/products"
                    replace
                    aria-label="Hapus pencarian"
                    className="flex-shrink-0 p-0.5 rounded-full transition-opacity hover:opacity-70"
                  >
                    <XMarkIcon className="w-4 h-4" style={{ color: 'rgba(232,213,176,0.7)' }} />
                  </Link>
                )}
              </div>
            </Form>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Category Pills (hanya tampil saat tidak ada query search) ── */}
      {!q && (
        <div
          className="sticky top-0 z-30 border-b overflow-x-auto"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#F0E6D6',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          <div className="flex items-center gap-2 px-5 py-2.5 w-max">
            {CATEGORIES.map((cat) => {
              const isActive =
                cat.href === '/products'
                  ? location.pathname === '/products' && !q
                  : location.pathname.startsWith(cat.href);

              return (
                <Link
                  key={cat.href}
                  to={cat.href}
                  prefetch="intent"
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap"
                  style={{
                    fontFamily: 'var(--font-body)',
                    backgroundColor: isActive ? '#6B3A1F' : 'transparent',
                    color: isActive ? '#FFFAF4' : '#6B3A1F',
                    border: `1.5px solid ${isActive ? '#6B3A1F' : '#E2CCB0'}`,
                  }}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search context bar (saat sedang search) ── */}
      {q && (
        <div
          className="flex items-center justify-between px-5 py-2.5 border-b"
          style={{ backgroundColor: '#FFF3E4', borderColor: '#F0E6D6' }}
        >
          <p className="text-xs" style={{ color: '#6B3A1F', fontFamily: 'var(--font-body)' }}>
            <span style={{ fontWeight: 600 }}>{count}</span> hasil untuk{' '}
            <span style={{ fontWeight: 600 }}>"{q}"</span>
          </p>
          <Link
            to="/products"
            replace
            className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}
          >
            <XMarkIcon className="w-3.5 h-3.5" /> Hapus
          </Link>
        </div>
      )}

      {/* ── Product Grid ── */}
      <section className="px-4 sm:px-5 pt-5 pb-8">
        {products && products.length > 0 ? (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <ProductListWithPagination
              products={products}
              paginationConfig={{ count, offset, limit }}
              context={`products${q ? `?q=${encodeURIComponent(q)}` : ''}`}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FFF3E4' }}
            >
              <MagnifyingGlassIcon className="w-7 h-7" style={{ color: '#C4A882' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#3D2B1F', fontFamily: 'var(--font-display)' }}>
                {q ? `Tidak ada hasil untuk "${q}"` : 'Belum ada produk'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>
                {q ? 'Coba kata kunci lain atau jelajahi semua menu.' : 'Produk segera hadir.'}
              </p>
            </div>
            {q && (
              <Link
                to="/products"
                className="text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200"
                style={{ backgroundColor: '#6B3A1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
              >
                Lihat Semua Menu
              </Link>
            )}
          </div>
        )}
      </section>

    </div>
  );
}
