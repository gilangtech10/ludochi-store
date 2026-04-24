import { ProductListWithPagination } from '@app/components/product/ProductListWithPagination';
import { fetchProducts } from '@libs/util/server/products.server';
import { listCategories } from '@libs/util/server/data/categories.server';
import { LoaderFunctionArgs } from 'react-router';
import { Form, useLoaderData, Link, useLocation, useNavigation } from 'react-router';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon, ShoppingBagIcon, FunnelIcon, BarsArrowUpIcon } from '@heroicons/react/24/outline';
import type { MetaFunction } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@app/hooks/useCart';
import clsx from 'clsx';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const q = data?.q;
  const cat = data?.activeCategory;
  if (q) return [{ title: `Pencarian "${q}" — LuDo-Chi` }];
  if (cat) return [{ title: `${cat} — Menu — LuDo-Chi` }];
  return [{ title: 'Menu — LuDo-Chi' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() || undefined;
  const categoryHandle = url.searchParams.get('category')?.trim() || undefined;
  const sort = url.searchParams.get('sort')?.trim() || undefined;
  const page = Number(url.searchParams.get('page') ?? 1);
  const limit = 12;
  const offset = (page - 1) * limit;

  let categoryId: string | undefined;
  let activeCategory: string | null = null;

  if (categoryHandle) {
    const categories = await listCategories();
    const matched = categories.find((c: any) => c.handle === categoryHandle);
    if (matched) {
      categoryId = matched.id;
      activeCategory = matched.name;
    }
  }

  let order: string | undefined;
  if (sort === 'price_asc') order = 'variants.prices.amount';
  else if (sort === 'price_desc') order = '-variants.prices.amount';
  else if (sort === 'name_asc') order = 'title';
  else if (sort === 'newest') order = '-created_at';

  const { products, count } = await fetchProducts(request, {
    q,
    category_id: categoryId,
    order,
    limit,
    offset,
  });

  return { products, count, limit, offset, q: q ?? null, activeCategory, categoryHandle: categoryHandle ?? null, sort: sort ?? null };
};

type SortValue = 'newest' | 'price_asc' | 'price_desc' | 'name_asc';

const SORT_OPTIONS: { label: string; value: SortValue }[] = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Harga Terendah', value: 'price_asc' },
  { label: 'Harga Tertinggi', value: 'price_desc' },
  { label: 'Nama A-Z', value: 'name_asc' },
];

const SORT_LABEL_MAP: Record<string, string> = {
  newest: 'Terbaru',
  price_asc: 'Harga Terendah',
  price_desc: 'Harga Tertinggi',
  name_asc: 'Nama A-Z',
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
  { label: 'Semua', href: '/products', handle: null },
  { label: 'Donat', href: '/products?category=donut', handle: 'donut' },
  { label: 'Mochi', href: '/products?category=mochi', handle: 'mochi' },
  { label: 'Minuman', href: '/products?category=drinks', handle: 'drinks' },
  { label: 'Bundle', href: '/products?category=bundle', handle: 'bundle' },
];

export default function ProductsIndexRoute() {
  const { products, count, limit, offset, q, activeCategory, categoryHandle, sort } = useLoaderData<ProductsIndexRouteLoader>();
  const location = useLocation();
  const navigation = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { cart, toggleCartDrawer } = useCart();
  const [showSortSheet, setShowSortSheet] = useState(false);

  const cartCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) ?? 0;

  const isSearching = navigation.state === 'loading' && !!navigation.location?.search?.includes('q=');
  const isLoadingProducts = navigation.state === 'loading' && !isSearching;

  const activeSortLabel = sort ? SORT_LABEL_MAP[sort] : null;

  // Build sort link preserving other params
  const buildSortHref = (sortValue: SortValue | null) => {
    const params = new URLSearchParams(location.search);
    if (sortValue) {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }
    params.delete('page');
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ''}`;
  };

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
            {q ? 'Hasil Pencarian' : activeCategory ?? 'Menu Kami'}
          </h1>
          {!q && !activeCategory && (
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
              {q ? `Hasil untuk "${q}"` : activeCategory ?? 'Menu Kami'}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'rgba(255,250,244,0.5)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              {count > 0 ? `${count} produk ditemukan` : q ? 'Tidak ada produk yang cocok' : activeCategory ? `Koleksi ${activeCategory}` : 'Jelajahi semua menu'}
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
              className="flex-1 min-w-0 flex items-center gap-1.5 rounded-xl px-2.5 h-9"
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

            {/* Sort button (mobile) */}
            <button
              type="button"
              onClick={() => setShowSortSheet(true)}
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 relative"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2CCB0',
                boxShadow: '0 1px 4px rgba(61,43,31,0.04)',
              }}
              aria-label="Urutkan"
            >
              <BarsArrowUpIcon className="w-4 h-4" style={{ color: '#6B3A1F' }} />
              {sort && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#C47C3A' }} />
              )}
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
              const isActive = cat.handle === categoryHandle;

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
          FILTER CONTEXT BAR
          ═══════════════════════════════════════════ */}
      {(q || activeCategory || sort) && (
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b md:px-6"
          style={{ backgroundColor: '#FFF3E4', borderColor: 'rgba(240,230,214,0.5)' }}
        >
          <p className="text-xs" style={{ color: '#6B3A1F', fontFamily: 'var(--font-body)' }}>
            <span style={{ fontWeight: 700 }}>{count}</span>{' '}
            {q ? (
              <>hasil untuk <span style={{ fontWeight: 700 }}>"{q}"</span></>
            ) : activeCategory ? (
              <>produk di <span style={{ fontWeight: 700 }}>{activeCategory}</span></>
            ) : (
              <>produk</>
            )}
            {activeSortLabel && (
              <> · <span style={{ fontWeight: 600 }}>{activeSortLabel}</span></>
            )}
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
            <div className="flex items-center gap-2">
              <h2
                className="text-sm md:text-base font-semibold"
                style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
              >
                {q ? `Hasil untuk "${q}"` : activeCategory ?? 'Semua Menu'}
              </h2>
              {activeSortLabel && (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: '#FFF3E4',
                    color: '#6B3A1F',
                    fontFamily: 'var(--font-label)',
                    border: '1px solid #E2CCB0',
                  }}
                >
                  {activeSortLabel}
                </span>
              )}
            </div>
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
              context={`products${(() => {
                const params = new URLSearchParams();
                if (q) params.set('q', q);
                if (categoryHandle) params.set('category', categoryHandle);
                if (sort) params.set('sort', sort);
                const qs = params.toString();
                return qs ? `?${qs}` : '';
              })()}`}
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
                {q ? `Tidak ada hasil untuk "${q}"` : activeCategory ? `Belum ada produk di kategori ${activeCategory}` : 'Belum ada produk'}
              </p>
              <p className="text-xs md:text-sm mt-1.5" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>
                {q ? 'Coba kata kunci lain atau jelajahi semua menu.' : activeCategory ? 'Coba kategori lain atau lihat semua menu.' : 'Produk segera hadir.'}
              </p>
            </div>
            {(q || activeCategory) && (
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

      {/* ═══════════════════════════════════════════
          SORT BOTTOM SHEET (mobile)
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {showSortSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-[60]"
              style={{ backgroundColor: 'rgba(61,43,31,0.45)' }}
              onClick={() => setShowSortSheet(false)}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl px-4 pt-4 pb-8"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 -8px 30px rgba(61,43,31,0.15)',
                paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#E2CCB0' }} />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-sm font-semibold"
                  style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
                >
                  Urutkan
                </h3>
                <button
                  onClick={() => setShowSortSheet(false)}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}
                >
                  Tutup
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((option) => {
                  const isActive = sort === option.value;
                  return (
                    <Link
                      key={option.value}
                      to={buildSortHref(isActive ? null : option.value)}
                      replace
                      onClick={() => setShowSortSheet(false)}
                      className="flex items-center justify-between px-3 py-3 rounded-xl transition-colors active:bg-[#FFF3E4]"
                      style={{
                        backgroundColor: isActive ? '#FFF3E4' : 'transparent',
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#6B3A1F' : '#3D2B1F',
                        }}
                      >
                        {option.label}
                      </span>
                      {isActive && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#6B3A1F' }}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#FFFAF4" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {sort && (
                <Link
                  to={buildSortHref(null)}
                  replace
                  onClick={() => setShowSortSheet(false)}
                  className="mt-3 w-full py-3 rounded-xl text-xs font-semibold text-center block transition-colors active:bg-[#F0E6D6]"
                  style={{
                    color: '#6B3A1F',
                    fontFamily: 'var(--font-label)',
                    border: '1px solid #E2CCB0',
                  }}
                >
                  Reset Urutan
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
