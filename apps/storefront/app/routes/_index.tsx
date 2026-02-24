import { fetchProducts } from '@libs/util/server/products.server';
import { useLoaderData, Link } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { getMergedPageMeta } from '@libs/util/page';
import { ProductPrice } from '@app/components/product/ProductPrice';
import { useRegion } from '@app/hooks/useRegion';

export const loader = async (args: LoaderFunctionArgs) => {
  const { products } = await fetchProducts(args.request, { limit: 3 });
  return { products };
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

export default function IndexRoute() {
  const { products } = useLoaderData<typeof loader>();
  const { region } = useRegion();

  return (
    <div className="bg-[#F5F2EB] text-[#2C1E16] w-full selection:bg-[#B0894A] selection:text-[#F5F2EB] relative">

      {/* Global Paper Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* 1. HERO SECTION (ACADEMIA THEME) */}
      <section className="relative w-full pt-[calc(var(--mkt-header-height)+4rem)] md:pt-[calc(var(--mkt-header-height-desktop)+6rem)] pb-24 px-6 md:px-12 lg:px-24 overflow-hidden bg-[#F5F2EB] border-b-4 border-double border-[#2C1E16]/40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">

          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-8 lg:pt-0">
            <span className="inline-block pb-2 mb-6 border-b border-[#B0894A] text-[#B0894A] text-[10px] font-bold tracking-[0.3em] uppercase">
              Bab I : Kisah Kopi & Kue
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight mb-8 leading-[1.1] text-[#2C1E16]">
              Tempat <span className="italic text-[#B0894A]">Nongkrong</span> <br className="hidden md:block" /> Favoritmu.
            </h1>

            <p className="text-lg md:text-xl text-[#2C1E16]/80 max-w-lg font-body leading-relaxed mb-12">
              Nikmati hangatnya kopi dan lembutnya donat mochi kami di ruang baca yang hening. Mengubah cerita sederhana menjadi lembaran sejarah yang manis.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mt-4">
              <Link
                to="/products"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-base font-display italic text-[#F5F2EB] bg-[#2C1E16] border border-[#2C1E16] rounded-none hover:bg-[#F5F2EB] hover:text-[#2C1E16] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 border border-[#B0894A] m-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <span className="relative z-10 flex items-center">
                  Intip Menu Kami
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform duration-500">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Right Cafe Photo Visual */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">

            {/* Vintage Photo Frame Layout */}
            <div className="relative z-10 w-full max-w-[500px] border border-[#B0894A]/30 bg-[#F5F2EB] p-3 md:p-5 shadow-sm group">
              <div className="overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
                  alt="LuDo-Chi Cafe Interior"
                  className="w-full h-[400px] md:h-[550px] object-cover grayscale-[40%] sepia-[30%] contrast-125 group-hover:grayscale-[20%] transition-all duration-[2s]"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-[#2C1E16]/20 pointer-events-none"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#F5F2EB] border border-[#2C1E16] py-2 px-4 shadow-sm z-20 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-500">
                <p className="text-[#2C1E16] font-body italic text-sm">Fig. 1 — Suasana Kafe</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. FEATURED MENU SECTION (ACADEMIA) */}
      <section className="py-24 md:py-32 px-6 relative z-20 bg-[#F5F2EB]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 px-4 border-b border-[#2C1E16] pb-12 w-full max-w-3xl mx-auto">
            <span className="inline-block py-1 mb-4 text-[#B0894A] text-[10px] font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-4">
              <span className="w-8 h-px bg-[#B0894A]"></span>
              Bab II : Sajian Utama
              <span className="w-8 h-px bg-[#B0894A]"></span>
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-[#2C1E16] italic">Koleksi Menu Pilihan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
            {products.map((product: any, index: number) => {
              const thumbnail = product.thumbnail || 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop';
              const isNew = product.tags?.some((t: any) => t.value.toLowerCase() === 'new');
              const badge = isNew ? 'Edisi Baru' : 'Klasik';

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-transparent border border-[#2C1E16] overflow-hidden transition-all duration-500 hover:bg-[#2C1E16] hover:text-[#F5F2EB]"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden border-b border-[#2C1E16] group-hover:border-[#B0894A]">
                    <img
                      src={thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover grayscale-[30%] sepia-[20%] group-hover:grayscale-0 transition-all duration-[1.5s] ease-out"
                    />
                    <div className="absolute top-0 right-0 z-20 bg-[#F5F2EB] text-[#2C1E16] border-b border-l border-[#2C1E16] group-hover:bg-[#B0894A] group-hover:text-[#F5F2EB] group-hover:border-[#B0894A] transition-colors duration-500 text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                      {badge}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between relative z-20">
                    <div>
                      <h3 className="text-2xl font-display font-medium mb-3 leading-tight group-hover:text-[#B0894A] transition-colors duration-300 line-clamp-2">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-current opacity-80 font-body italic text-sm mb-6 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#2C1E16] group-hover:border-[#B0894A]/30">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-60">Mahar</span>
                        <div className="text-lg font-display font-medium flex items-center">
                          <ProductPrice product={product} currencyCode={region?.currency_code || 'idr'} />
                        </div>
                      </div>
                      <Link
                        to={`/products/${product.handle}`}
                        className="text-xs uppercase tracking-[0.2em] font-bold hover:text-[#B0894A] transition-colors flex items-center gap-2"
                      >
                        Lihat
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform">
                          <path strokeLinecap="square" strokeLinejoin="miter" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-24">
            <Link
              to="/products"
              className="inline-flex items-center text-[#2C1E16] font-serif italic text-xl hover:opacity-60 transition-opacity border-b border-[#2C1E16] pb-1"
            >
              Lihat Seluruh Katalog
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION (ACADEMIA) */}
      <section className="py-24 md:py-32 px-6 bg-[#F5F2EB] border-t border-[#2C1E16]" id="about">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left: About Image in Vintage Frame */}
          <div className="w-full lg:w-1/2 relative bg-[#F5F2EB] border border-[#2C1E16] p-4">
            <div className="relative z-10 w-full aspect-[4/5] border border-[#2C1E16] bg-[#2C1E16]">
              <img
                src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop"
                alt="LuDo-Chi Bakery Interior"
                className="w-full h-full object-cover grayscale-[40%] sepia-[10%]"
              />
            </div>
            <p className="text-center font-serif italic text-sm mt-4">Fig. 2 — Dapur Utama LuDo-Chi</p>
          </div>

          {/* Right: About Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="inline-block py-1 mb-6 text-[#2C1E16] text-[10px] font-bold tracking-[0.3em] uppercase border-b border-[#2C1E16]/30 pb-2">Bab III : Manuksrip Kami</span>

            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-[#2C1E16] leading-tight">
              Di Balik Oven <br className="hidden lg:block" /> Yang Selalu <span className="italic">Hangat.</span>
            </h2>

            <p className="text-lg text-[#2C1E16]/80 font-serif italic leading-relaxed mb-6">
              "Kami percaya bahwa setiap gigitan roti yang manis bisa memperbaiki hari yang buruk. LuDo-Chi bukan sekadar toko roti, ini adalah catatan harian klasik dimana budaya Jepang bertemu kehangatan lokal."
            </p>

            <p className="text-lg text-[#2C1E16]/80 font-serif leading-relaxed mb-12">
              Ditulis dan diracik dengan dedikasi tinggi, setiap resep disempurnakan melalui waktu. Menghasilkan tekstur kenyal dan cerita rasa yang patut dikenang sepanjang generasi.
            </p>

            <div className="flex items-center gap-12 border-t border-[#2C1E16] pt-8 w-full justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <p className="text-4xl font-serif font-bold text-[#2C1E16]">X</p>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mt-2">Ribuan Karya</p>
              </div>
              <div className="w-px h-16 bg-[#2C1E16]" />
              <div className="text-center lg:text-left">
                <p className="text-4xl font-serif font-bold text-[#2C1E16] italic">Murni</p>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mt-2">Buatan Tangan</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. BUSINESS FEATURES (ACADEMIA DICTIONARY SECTION) */}
      <section className="py-32 px-6 bg-[#2C1E16] text-[#F5F2EB] border-t border-b border-[#F5F2EB]" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-w-2xl mx-auto border-b border-[#F5F2EB]/20 pb-12">
            <span className="inline-block py-1 mb-4 text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">Bab IV : Landasan Nilai</span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-white">Prinsip & Keunggulan Kami</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
            {/* Feature 1 */}
            <div className="flex flex-col relative before:hidden lg:before:block before:absolute before:-right-6 before:top-0 before:h-full before:w-px before:bg-[#F5F2EB]/20 pr-6">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">I. Bahan Premium</h3>
              <p className="text-[#F5F2EB]/70 font-serif leading-relaxed">
                Karya seni membutuhkan kanvas terbaik. Diimpor langsung dari sumber terpercaya dan dikurasi ketat demi menjaga standar literatur rasa.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col relative before:hidden lg:before:block before:absolute before:-right-6 before:top-0 before:h-full before:w-px before:bg-[#F5F2EB]/20 pr-6 md:before:block md:before:absolute md:before:-right-6 md:before:top-0 md:before:h-full md:before:w-px md:before:bg-[#F5F2EB]/20">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">II. Ritual Harian</h3>
              <p className="text-[#F5F2EB]/70 font-serif leading-relaxed">
                Bukan sekadar memanggang, ini adalah ritual subuh kami. Dedikasi harian untuk menjamin karya terbut selalu dalam kondisi prima.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col relative before:hidden lg:before:block before:absolute before:-right-6 before:top-0 before:h-full before:w-px before:bg-[#F5F2EB]/20 pr-6">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">III. Arsip Autentik</h3>
              <p className="text-[#F5F2EB]/70 font-serif leading-relaxed">
                Manuskrip resep kami dijaga lintas generasi. Sebuah keseimbangan mahakarya rasa klasik Jepang yang menenangkan saraf perasa.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">IV. Terverifikasi</h3>
              <p className="text-[#F5F2EB]/70 font-serif leading-relaxed">
                Sistem kurasi 100% Halal kami sangat tertata, memastikan ketenangan batin Anda dalam menyerap setiap bait rasa pada gigitan yang ada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INFO SECTION (ACADEMIA EDITORIAL) */}
      <section className="py-24 md:py-32 px-6 bg-[#F5F2EB] text-[#2C1E16]">
        <div className="max-w-7xl mx-auto border border-[#2C1E16] p-2 md:p-4">

          <div className="border border-[#2C1E16] p-8 md:p-16">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-[#2C1E16] pb-16 mb-16">

              <div className="max-w-xl">
                <span className="inline-block py-1 mb-6 text-[#2C1E16] text-[10px] font-bold tracking-[0.3em] uppercase">Epilog</span>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold italic leading-tight mb-6">
                  Bertemu dalam Cerita.
                </h2>
                <p className="text-lg text-[#2C1E16]/70 font-serif leading-relaxed">
                  Punya cerita untuk dibagikan, pesanan khusus layaknya komisi pelukis, atau sekadar ingin berbincang manis? Perpustakaan rasa kami siap menyambut.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

              {/* Jam Operasional */}
              <div className="md:border-r border-[#2C1E16] pr-8 last:border-0 last:pr-0">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 opacity-60">I. Operasional</h3>
                <div className="font-serif text-[#2C1E16] space-y-4">
                  <div className="flex justify-between border-b border-[#2C1E16]/20 pb-2">
                    <span className="italic">Senin - Jumat</span>
                    <span>08:00 — 20:00</span>
                  </div>
                  <div className="flex justify-between border-b border-[#2C1E16]/20 pb-2">
                    <span className="italic">Sabtu - Minggu</span>
                    <span>09:00 — 22:00</span>
                  </div>
                </div>
              </div>

              {/* Titik Lokasi */}
              <div className="md:border-r border-[#2C1E16] pr-8 last:border-0 last:pr-0">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 opacity-60">II. Titik Lokasi</h3>
                <div className="font-serif text-[#2C1E16]">
                  <p className="leading-relaxed mb-4">
                    Jl. Kenangan Manis No. 99<br />Jakarta Selatan, 12345
                  </p>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.2em] font-bold italic hover:opacity-60 transition-opacity border-b border-[#2C1E16]">
                    Navigasi Arah Buku
                  </a>
                </div>
              </div>

              {/* Korespondensi */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 opacity-60">III. Korespondensi</h3>
                <div className="font-serif flex flex-col gap-3">
                  <a href="mailto:hello@ludochi.com" className="hover:italic transition-all">surat@ludochi.com</a>
                  <a href="https://instagram.com" className="hover:italic transition-all">@ludochi.bakery</a>
                  <a href="https://whatsapp.com" className="hover:italic transition-all">+62-811-LUDO-CHI</a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
