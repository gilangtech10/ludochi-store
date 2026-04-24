import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { fetchProducts } from '@libs/util/server/products.server';
import { LoaderFunctionArgs } from 'react-router';
import { Form, useLoaderData, Link, useLocation, useNavigation } from 'react-router';
import { motion, Variants } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon, ShoppingBagIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { MetaFunction } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@app/hooks/useCart';
import clsx from 'clsx';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const q = data?.q;
  return [{ title: q ? `Pencarian "${q}" — LuDo-Chi` : 'Menu — LuDo-Chi' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() || undefined;
  const page = Number(url.searchParams.get('page') ?? 1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const { products, count } = await fetchProducts(request, { q, limit, offset });
  return { products, count, limit, offset, q: q ?? null };
};

export type ProductsIndexRouteLoader = typeof loader;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const CATEGORIES = [
  { label: 'Semua', href: '/products' },
  { label: 'Donat', href: '/categories/donut' },
  { label: 'Mochi', href: '/categories/mochi' },
  { label: 'Minuman', href: '/categories/drinks' },
  { label: 'Bundle', href: '/categories/bundle' },
];

export default function ProductsIndexRoute() {
  const { products, count, limit, offset, q } = useLoaderData<ProductsIndexRouteLoader>();
  const location = useLocation();
  const navigation = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { cart, toggleCartDrawer } = useCart();
  const [showFilters, setShowFilters] = useState(false);

  const cartCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) ?? 0;

  const isSearching = navigation.state === 'loading' && !!navigation.location?.search?.includes('q=');
  const isLoadingProducts = navigation.state === 'loading' && !isSearching;

  // Sync input value when navigating back/forward
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = q ?? '';
  }, [q]);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFAF4', color: '#3D2B1F' }}>
      {/* ═══════════════════════════════════════════
          MOBILE STICKY HEADER (md:hidden)
          ═══════════════════════════════════════════ */}
      <div
        className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14"
        style={{
          backgroundColor: 'rgba(255,250,244,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(240,230,214,0.6)',
        }}
      >
        <div className="flex flex-col">
          <h1
            className="text-[15px] font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
          >
            {q ? 'Hasil Pencarian' : 'Menu Kami'}
          </h1>
          {!q && (
            <span className="text-[10px] tracking-wider" style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}>
              ドーナツと餅パン
            </span>
          )}
        </div>
        <button
          onClick={() => toggleCartDrawer(true)}
          className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors active:bg-[#F0E6D6]"
          aria-label="Buka keranjang"
        >
          <ShoppingBagIcon className="w-6 h-6" style={{ color: '#3D2B1F' }} />
          {cartCount > 0 && (
            <span
              className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center px-1 text-[9px] font-bold rounded-full"
              style={{ backgroundColor: '#C47C3A', color: '#FFFFFF', fontFamily: 'var(--font-label)' }}
            >
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════════════
          DESKTOP HERO HEADER (hidden md:block)
          ═══════════════════════════════════════════ */}
      <section
        className="hidden md:block relative overflow-hidden px-8 lg:px-12 pt-12 pb-8"
        style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: '#E8D5B0' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: '#E8D5B0' }}
        />

        <motion.div variants={stagger} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
          <motion.p
            variants={fadeUp}
            className="text-[10px] tracking-[0.25em] uppercase mb-2"
            style={{ color: 'rgba(232,213,176,0.55)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
          >
            ドーナツと餅パン
          </motion.p>

          <motion.div variants={fadeUp} className="mb-5">
            <h1
              className="text-3xl lg:text-4xl"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#FFFAF4' }}
            >
              {q ? `Hasil untuk "${q}"` : 'Menu Kami'}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'rgba(255,250,244,0.5)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              {count > 0 ? `${count} produk ditemukan` : q ? 'Tidak ada produk yang cocok' : 'Jelajahi semua menu'}
            </p>
          </motion.div>

          {/* Desktop search bar */}
          <motion.div variants={fadeUp} className="max-w-md">
            <Form method="get" action="/products" className="relative">
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200 focus-within:bg-[rgba(255,250,244,0.18)] focus-within:border-[rgba(255,250,244,0.35)]"
                style={{ backgroundColor: 'rgba(255,250,244,0.12)', border: '1.5px solid rgba(255,250,244,0.2)' }}
              >
                {isSearching ? (
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                    style={{ borderColor: 'rgba(232,213,176,0.6)', borderTopColor: 'transparent' }}
                  />
                ) : (
                  <MagnifyingGlassIcon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: 'rgba(232,213,176,0.6)' }}
                  />
                )}
                <input
                  ref={inputRef}
                  name="q"
                  type="search"
                  defaultValue={q ?? ''}
                  placeholder="Cari donat, mochi, minuman…"
                  autoComplete="off"
                  className="flex-1 bg-transparent outline-none ring-0 text-sm min-w-0"
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

      {/* ═══════════════════════════════════════════
          MOBILE SEARCH BAR
          ═══════════════════════════════════════════ */}
      <div className="md:hidden px-4 pt-2.5 pb-2">
        <Form method="get" action="/products">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Search field */}
            <div
              className="flex-1 min-w-0 flex items-center gap-1.5 rounded-xl px-2.5 py-[6px]"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2CCB0',
                boxShadow: '0 1px 4px rgba(61,43,31,0.04)',
              }}
            >
              {isSearching ? (
                <div
                  className="w-3.5 h-3.5 rounded-full border-[1.5px] border-t-transparent animate-spin shrink-0"
                  style={{ borderColor: '#C4A882', borderTopColor: 'transparent' }}
                />
              ) : (
                <MagnifyingGlassIcon className="w-3.5 h-3.5 shrink-0" style={{ color: '#9C8070' }} />
              )}
              <input
                ref={inputRef}
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="Cari menu…"
                autoComplete="off"
                className="flex-1 min-w-0 bg-transparent text-xs placeholder:text-[#C4A882] appearance-none border-none outline-none ring-0 shadow-none rounded-none"
                style={{
                  color: '#3D2B1F',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                }}
              />
              {q && (
                <Link
                  to="/products"
                  replace
                  aria-label="Hapus pencarian"
                  className="shrink-0 p-0.5"
                >
                  <XMarkIcon className="w-3.5 h-3.5" style={{ color: '#9C8070' }} />
                </Link>
              )}
            </div>

            {/* Filter button (mobile) */}
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center active:scale-95"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2CCB0',
                boxShadow: '0 1px 4px rgba(61,43,31,0.04)',
              }}
              aria-label="Filter"
            >
              <FunnelIcon className="w-4 h-4" style={{ color: '#6B3A1F' }} />
            </button>
          </div>
        </Form>
      </div>

      {/* ═══════════════════════════════════════════
          CATEGORY PILLS
          ═══════════════════════════════════════════ */}
      {!q && (
        <div
          className="sticky top-14 md:top-0 z-30 overflow-x-auto border-b"
          style={{
            backgroundColor: 'rgba(255,250,244,0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(240,230,214,0.5)',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 w-max md:px-6 md:py-3">
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
                  className={clsx(
                    'flex-shrink-0 px-4 py-[7px] rounded-full text-[13px] font-semibold transition-all duration-200 whitespace-nowrap select-none active:scale-95',
                    isActive
                      ? 'shadow-sm'
                      : 'border hover:border-[#C4A882] hover:bg-white',
                  )}
                  style={{
                    fontFamily: 'var(--font-body)',
                    backgroundColor: isActive ? '#6B3A1F' : '#FFFFFF',
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

      {/* ═══════════════════════════════════════════
          SEARCH CONTEXT BAR
          ═══════════════════════════════════════════ */}
      {q && (
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b md:px-6"
          style={{ backgroundColor: '#FFF3E4', borderColor: 'rgba(240,230,214,0.5)' }}
        >
          <p className="text-xs" style={{ color: '#6B3A1F', fontFamily: 'var(--font-body)' }}>
            <span style={{ fontWeight: 700 }}>{count}</span> hasil untuk{' '}
            <span style={{ fontWeight: 700 }}>"{q}"</span>
          </p>
          <Link
            to="/products"
            replace
            className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70 active:opacity-50"
            style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}
          >
            <XMarkIcon className="w-3.5 h-3.5" /> Hapus
          </Link>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          PRODUCT GRID
          ═══════════════════════════════════════════ */}
      <section className="px-4 md:px-6 pt-4 pb-10">
        {/* Section header */}
        {products && products.length > 0 && (
          <div className="flex items-end justify-between mb-3">
            <h2
              className="text-sm md:text-base font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
            >
              {q ? `Hasil untuk "${q}"` : 'Semua Menu'}
            </h2>
            <span
              className="text-[11px] md:text-xs font-medium"
              style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}
            >
              {count} produk
            </span>
          </div>
        )}

        {products && products.length > 0 ? (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <ProductListWithPagination
              products={products}
              paginationConfig={{ count, offset, limit }}
              context={`products${q ? `?q=${encodeURIComponent(q)}` : ''}`}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#FFF3E4' }}
            >
              <MagnifyingGlassIcon className="w-8 h-8" style={{ color: '#C4A882' }} />
            </div>
            <div>
              <p
                className="text-sm md:text-base font-semibold"
                style={{ color: '#3D2B1F', fontFamily: 'var(--font-display)' }}
              >
                {q ? `Tidak ada hasil untuk "${q}"` : 'Belum ada produk'}
              </p>
              <p className="text-xs md:text-sm mt-1.5" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>
                {q ? 'Coba kata kunci lain atau jelajahi semua menu.' : 'Produk segera hadir.'}
              </p>
            </div>
            {q && (
              <Link
                to="/products"
                className="text-xs font-semibold px-6 py-3 rounded-full transition-all duration-200 active:scale-95"
                style={{ backgroundColor: '#6B3A1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
              >
                Lihat Semua Menu
              </Link>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
