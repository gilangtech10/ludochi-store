import { fetchProducts } from '@libs/util/server/products.server';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getMergedPageMeta } from '@libs/util/page';
import { ProductPrice } from '@app/components/product/ProductPrice';
import { useRegion } from '@app/hooks/useRegion';
import { motion, Variants } from 'framer-motion';
import {
  MapPinIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useCart } from '@app/hooks/useCart';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { products } = await fetchProducts(args.request, { limit: 6 });
  return { products };
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

const CATEGORIES = [
  { label: 'Semua',   href: '/products' },
  { label: 'Donat',   href: '/products?category=donut' },
  { label: 'Mochi',   href: '/products?category=mochi' },
  { label: 'Minuman', href: '/products?category=drinks' },
  { label: 'Bundle',  href: '/products?category=bundle' },
];

function useGreeting() {
  const [greeting, setGreeting] = useState('Selamat Datang');
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 11)      setGreeting('Selamat Pagi');
    else if (h < 15) setGreeting('Selamat Siang');
    else if (h < 18) setGreeting('Selamat Sore');
    else             setGreeting('Selamat Malam');
  }, []);
  return greeting;
}

export default function IndexRoute() {
  const { products } = useLoaderData<typeof loader>();
  const { region }   = useRegion();
  const greeting     = useGreeting();
  const { cart, toggleCartDrawer } = useCart();
  const rootLoader   = useRootLoaderData();
  const hasProducts  = rootLoader?.hasPublishedProducts;
  const cartCount    = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFAF4', color: '#3D2B1F' }}>

      {/* ─────────────────────────────────────────
          GREETING HEADER
      ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-5 pt-10 pb-8"
        style={{
          background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)',
        }}
      >
        {/* Subtle circle decoration */}
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

        <div className="relative flex items-start justify-between">
          {/* Left: greeting */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUp}
              className="text-[10px] tracking-[0.25em] uppercase mb-2"
              style={{ color: 'rgba(232,213,176,0.55)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              ドーナツと餅パン
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-2xl sm:text-3xl mb-1"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#FFFAF4' }}
            >
              {greeting}!
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-sm"
              style={{ color: 'rgba(255,250,244,0.55)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              Mau pesan apa hari ini?
            </motion.p>
          </motion.div>

          {/* Right: cart button */}
          {!!cart && hasProducts && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => toggleCartDrawer(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: 'rgba(255,250,244,0.12)', border: '1px solid rgba(255,250,244,0.2)' }}
              aria-label="Buka keranjang"
            >
              <ShoppingBagIcon className="w-5 h-5" style={{ color: '#FFFAF4' }} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-[9px] font-bold rounded-full"
                  style={{ backgroundColor: '#C47C3A', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </motion.button>
          )}
        </div>

        {/* Location chip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,250,244,0.1)', border: '1px solid rgba(255,250,244,0.15)' }}
        >
          <MapPinIcon className="w-3 h-3" style={{ color: 'rgba(232,213,176,0.7)' }} />
          <span
            className="text-[11px]"
            style={{ color: 'rgba(232,213,176,0.7)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
          >
            Sunter Jaya, Jakarta Utara
          </span>
        </motion.div>
      </section>


      {/* ─────────────────────────────────────────
          CATEGORY PILLS
      ───────────────────────────────────────── */}
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
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.href}
              to={cat.href}
              prefetch="intent"
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-body)',
                backgroundColor: i === 0 ? '#6B3A1F' : 'transparent',
                color: i === 0 ? '#FFFAF4' : '#6B3A1F',
                border: `1.5px solid ${i === 0 ? '#6B3A1F' : '#E2CCB0'}`,
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>


      {/* ─────────────────────────────────────────
          FEATURED BANNER
      ───────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/products" className="block relative overflow-hidden rounded-2xl" style={{ aspectRatio: '2.5 / 1' }}>
            <img
              src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=85&w=900&auto=format&fit=crop"
              alt="Menu LuDo-Chi"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(30,16,6,0.82) 0%, rgba(30,16,6,0.2) 70%, transparent 100%)' }}
            />
            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-7">
              <p
                className="text-[10px] tracking-[0.2em] uppercase mb-1.5"
                style={{ color: 'rgba(232,213,176,0.75)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
              >
                Menu Terbaru
              </p>
              <h2
                className="text-lg sm:text-xl leading-snug mb-3"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#FFFAF4' }}
              >
                Donat Lumer<br />Pilihan Hari Ini
              </h2>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold self-start px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,250,244,0.15)', color: '#FFFAF4', fontFamily: 'var(--font-label)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,250,244,0.25)' }}
              >
                Lihat Menu
                <ArrowRightIcon className="w-3 h-3" />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>


      {/* ─────────────────────────────────────────
          PRODUCT GRID
      ───────────────────────────────────────── */}
      <section className="px-5 pt-6 pb-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
        >
          <motion.div variants={fadeUp} className="flex items-center justify-between mb-4">
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              Menu Pilihan
            </h2>
            <Link
              to="/products"
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
            >
              Lihat Semua <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product: any) => {
              const thumbnail = product.thumbnail ||
                'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop';
              const isNew = product.tags?.some((t: any) => t.value.toLowerCase() === 'new');

              return (
                <motion.div variants={fadeUp} key={product.id}>
                  <Link
                    to={`/products/${product.handle}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border active:scale-95 transition-transform duration-150"
                    style={{ borderColor: '#F0E6D6' }}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
                      <img
                        src={thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isNew && (
                        <span
                          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ backgroundColor: '#6B3A1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
                        >
                          Baru
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p
                        className="text-sm leading-snug line-clamp-1 mb-0.5"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
                      >
                        {product.title}
                      </p>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: '#C47C3A', fontFamily: 'var(--font-body)' }}
                      >
                        <ProductPrice product={product} currencyCode={region?.currency_code || 'idr'} />
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>


      {/* ─────────────────────────────────────────
          ABOUT BANNER — compact app card
      ───────────────────────────────────────── */}
      <section className="px-5 pt-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="rounded-2xl overflow-hidden flex flex-col sm:flex-row"
            style={{ backgroundColor: '#FFF3E4', border: '1.5px solid #E2CCB0' }}
          >
            <div className="sm:w-2/5 overflow-hidden" style={{ aspectRatio: '16/7', flexShrink: 0 }}>
              <img
                src="https://images.unsplash.com/photo-1590080876351-41f7d8f46476?q=80&w=800&auto=format&fit=crop"
                alt="LuDo-Chi dapur"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex flex-col justify-center gap-3 sm:w-3/5">
              <p
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
              >
                Tentang Kami
              </p>
              <h3
                className="text-lg leading-snug"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
              >
                Dibuat Fresh,<br />Setiap Hari.
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}
              >
                Donat lumer &amp; mochi pillow dari bahan pilihan,
                tanpa pengawet — selalu hadir untuk kamu.
              </p>
              <Link
                to="/about-us"
                className="inline-flex items-center gap-1.5 text-xs font-semibold self-start"
                style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}
              >
                Selengkapnya <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>


      {/* ─────────────────────────────────────────
          INFO ROW — jam, lokasi, kontak
      ───────────────────────────────────────── */}
      <section className="px-5 pt-4 pb-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            {
              label: 'Jam Buka',
              value: '09:00 – 22:00',
              sub: 'Buka setiap hari',
              href: null,
            },
            {
              label: 'Lokasi',
              value: 'Sunter Jaya',
              sub: 'Jakarta Utara',
              href: 'https://maps.google.com',
            },
            {
              label: 'Kontak',
              value: '@ludochi.id',
              sub: 'order@ludochi.id',
              href: 'https://instagram.com/ludochi.id',
            },
          ].map((item) => (
            <motion.div
              variants={fadeUp}
              key={item.label}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between bg-white rounded-2xl px-4 py-3.5 border transition-opacity hover:opacity-75"
                  style={{ borderColor: '#F0E6D6' }}
                >
                  <div>
                    <p className="text-[10px] ludo-label mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}>{item.value}</p>
                    <p className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>{item.sub}</p>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#C47C3A' }} />
                </a>
              ) : (
                <div
                  className="flex items-center justify-between bg-white rounded-2xl px-4 py-3.5 border"
                  style={{ borderColor: '#F0E6D6' }}
                >
                  <div>
                    <p className="text-[10px] ludo-label mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}>{item.value}</p>
                    <p className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>{item.sub}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
}
