import { LogoStoreName } from '@app/components/LogoStoreName/LogoStoreName';
import { Container } from '@app/components/common/container/Container';
import { Select } from '@app/components/common/forms/inputs/Select';
import { URLAwareNavLink } from '@app/components/common/link/URLAwareNavLink';
import { NewsletterSubscription } from '@app/components/newsletter/Newsletter';
import { useRegion } from '@app/hooks/useRegion';
import { useRegions } from '@app/hooks/useRegions';
import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { useSiteDetails } from '@app/hooks/useSiteDetails';
import { convertToFormData } from '@libs/util/forms/objectToFormData';
import { useMemo } from 'react';
import { useFetcher } from 'react-router';
import { StripeSecurityImage } from '../../images/StripeSecurityImage';

const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const Footer = () => {
  const { footerNavigationItems } = useSiteDetails();
  const rootData = useRootLoaderData();
  const fetcher = useFetcher();
  const { regions } = useRegions();
  const { region } = useRegion();

  const regionOptions = useMemo(() => {
    return regions.map((r) => ({
      label: `${r.name} (${r.currency_code})`,
      value: r.id,
    }));
  }, [regions]);

  const onRegionChange = (regionId: string) => {
    fetcher.submit(
      convertToFormData({ regionId }),
      { method: 'post', action: '/api/region' },
    );
  };

  return (
    <footer
      className="py-20 lg:py-24 relative overflow-hidden"
      style={{
        backgroundColor: '#1C1714',
        color: '#E8DFD4',
        borderTop: '1px solid #4A3F35',
      }}
    >
      {/* Paper texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 mix-blend-overlay"
        style={{ backgroundImage: PAPER_TEXTURE, opacity: 0.04 }}
      />

      <Container className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

        {/* ── Top grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 pb-20 border-b border-[#4A3F35]">

          {/* Brand */}
          <div className="lg:col-span-5 flex flex-col items-start gap-8">
            <div>
              <h3
                className="text-4xl italic leading-snug"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
              >
                LuDoChi<br />
                <span style={{ color: '#C9A962' }}>Café</span>
              </h3>
            </div>
            <p
              className="text-lg leading-relaxed max-w-sm"
              style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
            >
              Premium café in Jakarta featuring handmade donuts,
              pillowy mochi, and quality coffee &amp; matcha. Dine-in,
              take away, or order online — open daily 09:00–22:00.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-2">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center transition-colors duration-200"
                style={{ border: '1px solid rgba(201,169,98,0.4)', color: '#9C8B7A' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#C9A962';
                  (e.currentTarget as HTMLElement).style.color = '#1C1714';
                  (e.currentTarget as HTMLElement).style.borderColor = '#C9A962';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#9C8B7A';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,98,0.4)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="mailto:hello@ludochi.com"
                aria-label="Email"
                className="w-10 h-10 flex items-center justify-center transition-colors duration-200"
                style={{ border: '1px solid rgba(201,169,98,0.4)', color: '#9C8B7A' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#C9A962';
                  (e.currentTarget as HTMLElement).style.color = '#1C1714';
                  (e.currentTarget as HTMLElement).style.borderColor = '#C9A962';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#9C8B7A';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,98,0.4)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16v12H4z" /><polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1" />

          {/* Navigation index */}
          <div className="lg:col-span-2">
            <h4
              className="mb-8 pb-4 border-b border-[#4A3F35]"
              style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A962' }}
            >
              Index
            </h4>
            <nav className="flex flex-col gap-4">
              {footerNavigationItems?.map(({ id, new_tab, ...navItemProps }) => (
                <URLAwareNavLink
                  key={id}
                  {...navItemProps}
                  newTab={new_tab}
                  className="italic text-lg hover:text-[#C9A962] transition-colors duration-200 w-fit"
                  style={{ fontFamily: 'var(--font-display)', color: '#E8DFD4' }}
                  prefetch="viewport"
                >
                  {navItemProps.label}
                </URLAwareNavLink>
              ))}
            </nav>
          </div>

          {/* Newsletter + address */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            <div>
              <h4
                className="mb-8 pb-4 border-b border-[#4A3F35]"
                style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A962' }}
              >
                Correspondence
              </h4>
              <NewsletterSubscription className="w-full" />
            </div>

            <div>
              <h4
                className="italic text-xl mb-4"
                style={{ fontFamily: 'var(--font-display)', color: '#E8DFD4' }}
              >
                Our Location
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
              >
                Jakarta, Indonesia<br />
                Open Daily, 09:00 – 22:00
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────── */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div
            className="flex flex-col md:flex-row items-center gap-4 text-xs tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-label)', color: 'rgba(156,139,122,0.6)' }}
          >
            <p>© {new Date().getFullYear()} LuDoChi Café</p>
            <span className="hidden md:block w-px h-3 bg-[#4A3F35]" />
            <a href="#" className="hover:text-[#C9A962] transition-colors duration-200">Privacy Policy</a>
            <span className="hidden md:block w-px h-3 bg-[#4A3F35]" />
            <a href="#" className="hover:text-[#C9A962] transition-colors duration-200">Terms &amp; Conditions</a>
          </div>

          <div className="flex items-center gap-6">
            <Select
              className="text-xs uppercase tracking-widest border rounded-none bg-transparent shadow-none focus:border-[#C9A962] px-4 py-2 min-w-[140px]"
              style={{ borderColor: 'rgba(201,169,98,0.4)', color: '#9C8B7A' }}
              options={regionOptions}
              defaultValue={region?.id}
              onChange={(e) => onRegionChange(e.target.value)}
            />
          </div>
        </div>

      </Container>
    </footer>
  );
};
