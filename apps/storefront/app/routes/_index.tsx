import { fetchProducts } from '@libs/util/server/products.server';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getMergedPageMeta } from '@libs/util/page';
import { ProductPrice } from '@app/components/product/ProductPrice';
import { useRegion } from '@app/hooks/useRegion';
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

export const loader = async (args: LoaderFunctionArgs) => {
  const { products } = await fetchProducts(args.request, { limit: 3 });
  return { products };
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

// Paper texture SVG (inline, no separate file needed)
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function IndexRoute() {
  const { products } = useLoaderData<typeof loader>();
  const { region } = useRegion();

  return (
    <div
      className="w-full selection:bg-[#C9A962] selection:text-[#1C1714] relative"
      style={{ backgroundColor: '#1C1714', color: '#E8DFD4' }}
    >

      {/* ── Global atmospheric overlays ─────────────────────────────── */}

      {/* Paper grain texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
        style={{ backgroundImage: PAPER_TEXTURE, opacity: 0.03 }}
      />
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 vignette-overlay"
      />


      {/* ═══════════════════════════════════════════════════════════════
          VOLUME I — HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden border-b border-[#4A3F35]"
        style={{
          paddingTop: 'calc(var(--mkt-header-height-desktop) + 5rem)',
          paddingBottom: '6rem',
          backgroundColor: '#1C1714',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">

          {/* ── Left: Text ── */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left"
          >

            <motion.span variants={fadeUpVariant} className="academia-label mb-8">Volume I &nbsp;·&nbsp; Lumer Donat &amp; Mochi — Jakarta</motion.span>

            <motion.h1
              variants={fadeUpVariant}
              className="text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.08] tracking-tight mb-8"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
            >
              Your Favourite<br />
              <em style={{ color: '#C9A962' }}>Sweet</em> Retreat.
            </motion.h1>

            <motion.p
              variants={fadeUpVariant}
              className="text-lg md:text-xl leading-relaxed max-w-lg mb-12"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.8)' }}
            >
              Enjoy our freshly-made homemade donuts, pillowy mochi, quality coffee
              &amp; matcha in a cozy aesthetic café. Dine-in, take away, or order online
              — LuDoChi is always here for you.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <Link to="/products" className="btn-brass engraved w-full sm:w-auto gap-3">
                Explore Our Menu
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
              <Link to="/about-us" className="btn-outline-brass w-full sm:w-auto">
                Our Story
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Right: Image in vintage frame ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-[45%] flex justify-center lg:justify-end"
          >
            <div className="ornate-frame ornate-frame-lg relative w-full max-w-[480px] p-3 group" style={{ backgroundColor: '#251E19', border: '1px solid #4A3F35' }}>

              {/* Arch-top image container */}
              <div className="arch-top overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
                  alt="LuDoChi Cafe Interior — a warm scholarly reading room"
                  className="w-full h-full object-cover sepia-aged scale-[1.02] group-hover:scale-[1.07] transition-transform duration-700"
                />
              </div>

              {/* Caption tag */}
              <div
                className="absolute -bottom-4 -right-4 py-2 px-5 z-20 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-500"
                style={{ backgroundColor: '#251E19', border: '1px solid #C9A962' }}
              >
                <p className="text-sm italic" style={{ fontFamily: 'var(--font-body)', color: '#E8DFD4' }}>
                  Fig. 1 — The Reading Room
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          VOLUME II — FEATURED COLLECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 relative z-20" style={{ backgroundColor: '#1C1714' }}>
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Section header */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20 max-w-2xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeUpVariant} className="academia-label-row justify-center mx-auto mb-6">Volume II &nbsp;·&nbsp; Featured Collection</motion.div>
            <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl italic text-center w-full" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}>
              Curated Menu Selections
            </motion.h2>
            <motion.div variants={fadeUpVariant} className="ornate-divider mt-10 mx-auto w-64" />
          </motion.div>

          {/* Product grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12"
          >
            {products.map((product: any, index: number) => {
              const thumbnail = product.thumbnail || 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop';
              const isNew = product.tags?.some((t: any) => t.value.toLowerCase() === 'new');
              const volumeNums = ['I', 'II', 'III'];

              return (
                <motion.div
                  variants={fadeUpVariant}
                  key={product.id}
                  className="academia-card group flex flex-col overflow-hidden"
                >
                  {/* Image with arch-top */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover sepia-aged group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Badge */}
                    <div
                      className="absolute top-3 right-3 z-20 py-1 px-3"
                      style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '0.55rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        backgroundColor: isNew ? '#8B2635' : 'transparent',
                        border: `1px solid ${isNew ? '#8B2635' : '#C9A962'}`,
                        color: isNew ? '#E8DFD4' : '#C9A962',
                      }}
                    >
                      {isNew ? 'New Edition' : 'Classic'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="academia-label mb-3 block">Vol. {volumeNums[index] || index + 1}</span>
                      <h3
                        className="text-2xl mb-3 leading-tight line-clamp-2 group-hover:text-[#C9A962] transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                      >
                        {product.title}
                      </h3>
                      {product.description && (
                        <p
                          className="italic text-sm mb-6 line-clamp-2 leading-relaxed"
                          style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
                        >
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#4A3F35]">
                      <div className="flex flex-col">
                        <span className="academia-label mb-1">Price</span>
                        <div className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                          <ProductPrice product={product} currencyCode={region?.currency_code || 'idr'} />
                        </div>
                      </div>
                      <Link
                        to={`/products/${product.handle}`}
                        className="inline-flex items-center gap-2 text-[#C9A962] hover:text-[#D4B872] transition-colors duration-200 underline underline-offset-4"
                        style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                      >
                        View
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* View all link */}
          <div className="text-center mt-20">
            <Link
              to="/products"
              className="text-xl italic hover:text-[#C9A962] transition-colors duration-300 border-b border-[#4A3F35] hover:border-[#C9A962] pb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Browse the Complete Catalogue
            </Link>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          VOLUME III — THE MANUSCRIPT (ABOUT)
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 px-6 border-t border-[#4A3F35]"
        id="about"
        style={{ backgroundColor: '#251E19' }}
      >
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
        >

          {/* Left: Framed image */}
          <motion.div variants={fadeUpVariant} className="w-full lg:w-1/2 ornate-frame p-4" style={{ backgroundColor: '#1C1714', border: '1px solid #4A3F35' }}>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5', border: '1px solid #4A3F35' }}>
              <img
                src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop"
                alt="LuDoChi bakery kitchen — handcrafting mochi bread daily"
                className="w-full h-full object-cover sepia-aged"
              />
            </div>
            <p
              className="text-center italic text-sm mt-4"
              style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
            >
              Fig. 2 — The Main Kitchen, LuDoChi
            </p>
          </motion.div>

          {/* Right: Text */}
          <motion.div variants={fadeUpVariant} className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="academia-label mb-8">Volume III &nbsp;·&nbsp; Our Story</span>

            <h2
              className="text-4xl md:text-5xl mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
            >
              Made with Love,<br className="hidden lg:block" />
              <em>Served with Passion.</em>
            </h2>

            <div className="ornate-divider w-48 mb-8 mx-0" />

            <p
              className="text-lg italic leading-relaxed mb-6 drop-cap"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.85)' }}
            >
              "We believe every perfect bite can turn an ordinary day into something
              special. LuDoChi was born from the passion to bring premium quality
              homemade donuts and pillowy mochi — accessible to everyone."
            </p>

            <p
              className="text-lg leading-relaxed mb-12"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.75)' }}
            >
              Each product is crafted with quality ingredients, free from artificial
              preservatives, and always made fresh daily. Enjoy it in-store,
              take it away, or order via our website and favourite marketplaces.
            </p>

            {/* Stats */}
            <div
              className="flex items-center gap-12 pt-8 w-full justify-center lg:justify-start border-t border-[#4A3F35]"
            >
              <div className="text-center lg:text-left">
                <p
                  className="text-4xl"
                  style={{ fontFamily: 'var(--font-display)', color: '#C9A962' }}
                >
                  10K+
                </p>
                <p className="academia-label mt-2">Happy Patrons</p>
              </div>
              <div className="w-px h-16 bg-[#4A3F35]" />
              <div className="text-center lg:text-left">
                <p
                  className="text-4xl italic"
                  style={{ fontFamily: 'var(--font-display)', color: '#C9A962' }}
                >
                  Pure
                </p>
                <p className="academia-label mt-2">Handcrafted Daily</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          VOLUME IV — PRINCIPLES & VALUES
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="py-32 px-6 border-t border-b border-[#4A3F35]"
        id="features"
        style={{ backgroundColor: '#1C1714', color: '#E8DFD4' }}
      >
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={fadeUpVariant} className="text-center mb-24 max-w-2xl mx-auto border-b border-[#4A3F35] pb-12 flex flex-col items-center">
            <div className="academia-label-row justify-center mx-auto mb-6">Volume IV &nbsp;·&nbsp; Pillars of Excellence</div>
            <h2
              className="text-4xl md:text-5xl italic text-center w-full"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              Our Principles &amp; Craft
            </h2>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
            {[
              {
                num: 'I',
                title: 'Premium Ingredients',
                body: 'Every LuDoChi product is made from carefully selected high-quality ingredients — premium flour, finest chocolate, and fresh fillings chosen to ensure the best flavour in every single bite.',
              },
              {
                num: 'II',
                title: 'Always Fresh',
                body: 'No artificial preservatives — always made fresh every day. Our lumer donuts and pillowy mochi are prepared with full dedication so they reach you in their best condition.',
              },
              {
                num: 'III',
                title: 'Accessible & Cozy',
                body: 'Premium does not mean exclusive. LuDoChi is here for everyone who wants quality products in a cozy aesthetic café setting — dine-in, take away, or delivery.',
              },
              {
                num: 'IV',
                title: '100% Halal',
                body: 'All LuDoChi products are guaranteed 100% Halal, using safe and certified ingredients, giving complete peace of mind to every customer who enjoys our products.',
              },
            ].map((item, i) => (
              <motion.div
                variants={fadeUpVariant}
                key={item.num}
                className={`flex flex-col relative pr-6${i < 3 ? ' before:hidden lg:before:block before:absolute before:-right-6 before:top-0 before:h-full before:w-px before:bg-[#4A3F35]' : ''}`}
              >
                <span className="academia-label mb-2">{item.num}</span>
                <h3
                  className="text-2xl mb-4"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
                >
                  {item.title}
                </h3>
                <p className="leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          EPILOGUE — VISIT & CONTACT
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 px-6"
        style={{ backgroundColor: '#251E19', color: '#E8DFD4' }}
      >
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto border border-[#4A3F35] p-2 md:p-4"
        >
          <div className="ornate-frame border border-[#4A3F35] p-8 md:p-16">

            {/* Header */}
            <motion.div variants={fadeUpVariant} className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-16 mb-16 border-b border-[#4A3F35]">
              <div className="max-w-xl">
                <span className="academia-label mb-6 block">Epilogue</span>
                <h2
                  className="text-4xl md:text-5xl lg:text-7xl italic leading-tight mb-6"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                >
                  Visit &amp; Savor the Distinction.
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
                >
                  Looking to order in bulk, a special bundling, or just want to say hello?
                  We're ready to serve you through all channels — from our website, marketplace,
                  to visiting us directly at our Jakarta location.
                </p>
              </div>
            </motion.div>

            {/* Info columns */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-12">

              {/* Hours */}
              <motion.div variants={fadeUpVariant} className="md:border-r border-[#4A3F35] last:border-0 pr-8 last:pr-0">
                <h3 className="academia-label mb-6">I. &nbsp;Hours of Operation</h3>
                <div className="space-y-4" style={{ fontFamily: 'var(--font-body)' }}>
                  <div className="flex justify-between border-b border-[#4A3F35] pb-2">
                    <span className="italic">Monday – Sunday</span>
                    <span>09:00 – 22:00</span>
                  </div>
                  <div className="flex justify-between border-b border-[#4A3F35] pb-2">
                    <span className="italic">Public Holidays</span>
                    <span>09:00 – 22:00</span>
                  </div>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div variants={fadeUpVariant} className="md:border-r border-[#4A3F35] last:border-0 pr-8 last:pr-0">
                <h3 className="academia-label mb-6">II. &nbsp;Our Location</h3>
                <div style={{ fontFamily: 'var(--font-body)' }}>
                  <p className="leading-relaxed mb-4" style={{ color: '#E8DFD4' }}>
                    Jl. H. Mawar No.51, RT.3/RW.3, Sunter Jaya,<br />Kec. Tj. Priok, Jkt Utara, DKI Jakarta 14350
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="italic hover:text-[#C9A962] transition-colors duration-200 border-b border-[#4A3F35] hover:border-[#C9A962] pb-0.5"
                    style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: '#9C8B7A' }}
                  >
                    Navigate via Maps →
                  </a>
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div variants={fadeUpVariant}>
                <h3 className="academia-label mb-6">III. &nbsp;Correspondence</h3>
                <div
                  className="flex flex-col gap-3"
                  style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
                >
                  <a href="mailto:hello@ludochi.com" className="hover:text-[#C9A962] hover:italic transition-all duration-200">
                    order@ludochi.id
                  </a>
                  <a href="https://instagram.com" className="hover:text-[#C9A962] hover:italic transition-all duration-200">
                    @ludochi.id
                  </a>
                  <a href="tel:+628111234567" className="hover:text-[#C9A962] hover:italic transition-all duration-200">
                    +62-811-2222-3333
                  </a>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
