import { Container } from '@app/components/common/container';
import { getMergedPageMeta } from '@libs/util/page';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type LocationProps = {
  volume: string;
  title: string;
  hours: string[];
  phone: string;
  addressLines: string[];
  imageUrl: string;
  description: string;
};

const locations: LocationProps[] = [
  {
    volume: 'Vol. I',
    title: 'LuDoChi — Jakarta',
    addressLines: ['Jakarta, Indonesia'],
    phone: '+62-811-LUDO-CHI',
    hours: ['Monday – Sunday: 09:00 – 22:00', 'Including public holidays'],
    imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1200&auto=format&fit=crop',
    description:
      'Our very first LuDoChi outpost in Jakarta — where our lumer donuts and pillowy mochi first came to life. An aesthetic café with a warm, inviting atmosphere perfect for hanging out, meetings, or a quiet me-time.',
  },
];

const principles = [
  {
    numeral: 'I',
    title: 'Handmade Donuts',
    text: 'Our signature — freshly handcrafted donuts made every day with no artificial preservatives. With a soft, pillowy texture and ever-expanding fillings, each donut is a creation of its own.',
  },
  {
    numeral: 'II',
    title: 'Mochi & Matcha',
    text: 'Beyond donuts, we offer pillowy soft mochi and quality matcha paired with curated coffee — crafting a flavour experience that delights with every sip and every bite.',
  },
  {
    numeral: 'III',
    title: 'Multi-Channel Order',
    text: 'Order anywhere: dine-in, take away, our official website, or your favourite marketplace. Delivery and bundling menus are also available for the most complete experience.',
  },
  {
    numeral: 'IV',
    title: '100% Halal',
    text: 'All LuDoChi ingredients and production processes are guaranteed 100% Halal and safe for consumption. We are committed to giving every customer complete peace of mind.',
  },
];

export const loader = async (args: LoaderFunctionArgs) => {
  return {};
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

const LocationEntry = ({ volume, title, addressLines, phone, hours, imageUrl, description }: LocationProps) => {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-5 gap-0 border-b border-[#4A3F35] last:border-0">
      {/* Volume label sidebar */}
      <div
        className="hidden lg:flex flex-col items-center justify-start pt-16 border-r border-[#4A3F35] pr-8"
        aria-hidden="true"
      >
        <span
          className="block text-center leading-none mb-3"
          style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9C8B7A' }}
        >
          {volume}
        </span>
        <div className="w-px flex-1" style={{ backgroundColor: '#4A3F35', maxHeight: '80px' }} />
      </div>

      {/* Main content */}
      <div className="col-span-4 pl-0 lg:pl-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Image */}
          <div className="group overflow-hidden" style={{ border: '1px solid #4A3F35' }}>
            <div
              className="w-full h-72 bg-cover bg-no-repeat bg-center sepia-aged group-hover:brightness-110 transition-all duration-700 ease-out"
              style={{ backgroundImage: `url(${imageUrl})` }}
              role="img"
              aria-label={title}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5 justify-center">
            {/* Mobile volume */}
            <span
              className="block lg:hidden"
              style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9C8B7A' }}
            >
              {volume}
            </span>

            <h3
              className="text-2xl md:text-3xl leading-snug"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
            >
              {title}
            </h3>

            <p
              className="italic leading-relaxed text-sm"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.65)' }}
            >
              {description}
            </p>

            <hr style={{ borderColor: '#4A3F35', borderTopWidth: 1 }} />

            <div className="grid grid-cols-1 gap-3">
              <div>
                <span className="academia-label mb-1 block">Address</span>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.7)' }}>
                  {addressLines.map((line, i) => <p key={i}>{line}</p>)}
                  <p className="mt-1" style={{ color: '#C9A962' }}>p. {phone}</p>
                </div>
              </div>
              <div>
                <span className="academia-label mb-1 block">Hours</span>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.7)' }}>
                  {hours.map((hour, i) => <p key={i}>{hour}</p>)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
};

export default function AboutUsRoute() {
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

      {/* ══════════════════════════════════════════════
          §1 — HERO
      ══════════════════════════════════════════════ */}
      <div
        className="relative w-full border-b border-[#4A3F35] overflow-hidden"
        style={{ paddingTop: 'calc(var(--mkt-header-height-desktop) + 5rem)', paddingBottom: '6rem' }}
      >
        {/* Vertical margin rules */}
        {[0, 1].map((side) => (
          <div
            key={side}
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 bottom-0 w-px ${side === 0 ? 'left-0' : 'right-0'}`}
            style={{ background: 'linear-gradient(180deg, transparent, #4A3F35 25%, #4A3F35 75%, transparent)' }}
          />
        ))}

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          {/* Overline ornament */}
          <div className="academia-label-row mb-8 max-w-[12rem] mx-auto">
            Institutional Record
          </div>

          {/* Main heading */}
          <h1
            className="text-6xl md:text-8xl leading-[1.02] tracking-tight mb-8"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
          >
            Our{' '}
            <em style={{ color: '#C9A962', fontStyle: 'italic' }}>Chronicle</em>
          </h1>

          {/* Drop-cap opening paragraph */}
          <p
            className="text-xl md:text-2xl italic leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.75)' }}
          >
            <span style={{ color: '#E8DFD4' }}>LuDoChi</span> is a premium café in Jakarta
            born from a love of great flavour. We bring freshly handmade donuts,
            pillowy mochi, and curated drinks in a cozy aesthetic space
            —{' '}
            <strong style={{ color: '#E8DFD4', fontStyle: 'normal' }}>
              for every young person seeking a luxury hangout that feels like home.
            </strong>
          </p>

          {/* Ornate divider */}
          <div className="ornate-divider w-48 mx-auto mb-4" />

          <p
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#9C8B7A',
            }}
          >
            Est. MM·XXVI &nbsp;·&nbsp; Jakarta &nbsp;·&nbsp; Donat &amp; Mochi
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          §2 — FOUNDATIONAL PRINCIPLES
      ══════════════════════════════════════════════ */}
      <div
        className="relative border-b border-[#4A3F35]"
        style={{ backgroundColor: '#1A1512' }}
      >
        <Container className="py-20 md:py-28 relative z-10">
          {/* Section heading */}
          <div className="text-center mb-16 md:mb-20">
            <span className="academia-label mb-4 block">Article I</span>
            <h2
              className="text-4xl md:text-5xl"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              The <em style={{ color: '#C9A962' }}>Founding</em> Principles
            </h2>
          </div>

          {/* Principles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ borderColor: '#4A3F35', border: '1px solid #4A3F35' }}>
            {principles.map((p) => (
              <div
                key={p.numeral}
                className="p-8 md:p-10 group transition-colors duration-300 hover:bg-[#1C1714]"
                style={{ borderRight: '1px solid #4A3F35', borderBottom: '1px solid #4A3F35' }}
              >
                <div
                  className="text-6xl leading-none mb-5 select-none"
                  style={{
                    fontFamily: 'var(--font-label)',
                    color: 'rgba(201,169,98,0.15)',
                    letterSpacing: '-0.02em',
                    transition: 'color 300ms',
                  }}
                >
                  {p.numeral}
                </div>
                <h3
                  className="text-xl mb-4 transition-colors duration-300 group-hover:text-[#C9A962]"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
                >
                  {p.title}
                </h3>
                <p
                  className="italic leading-relaxed text-sm"
                  style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.65)' }}
                >
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ══════════════════════════════════════════════
          §3 — REGISTERED LOCATIONS
      ══════════════════════════════════════════════ */}
      <div className="relative">
        <Container className="py-20 md:py-28 relative z-10">
          {/* Section heading */}
          <div className="text-center mb-16 md:mb-20">
            <span className="academia-label mb-4 block">Article II</span>
            <h2
              className="text-4xl md:text-5xl"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
            >
              Find Your <em style={{ color: '#C9A962' }}>Chapter</em>
            </h2>
            <p
              className="italic mt-4 text-base max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.55)' }}
            >
              Three locations, each a distinct chapter in the same story. Visit us.
            </p>
          </div>

          {/* Location entries */}
          <div className="border-t border-[#4A3F35]">
            {locations.map((location, i) => (
              <LocationEntry key={i} {...location} />
            ))}
          </div>
        </Container>
      </div>

      {/* ══════════════════════════════════════════════
          §4 — CLOSING COLOPHON
      ══════════════════════════════════════════════ */}
      <div
        className="relative border-t border-[#4A3F35] py-20 text-center"
        style={{ backgroundColor: '#1A1512' }}
      >
        <div className="max-w-xl mx-auto px-6 relative z-10">
          <div className="ornate-divider w-32 mx-auto mb-8" />
          <p
            className="text-3xl md:text-4xl italic mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
          >
            "To craft is to care. To share is{' '}
            <em style={{ color: '#C9A962' }}>to live.</em>"
          </p>
          <p
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#9C8B7A',
            }}
          >
            LuDo-Chi &nbsp;·&nbsp; Founder's Colophon &nbsp;·&nbsp; MM·XXVI
          </p>
        </div>
      </div>

    </div>
  );
}
