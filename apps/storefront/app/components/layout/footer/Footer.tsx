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
      className="pt-16 pb-10 relative overflow-hidden"
      style={{
        backgroundColor: '#FFF3E4',
        borderTop: '2px solid #E2CCB0',
      }}
    >
      <Container className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Top grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b-2 border-[#E2CCB0]">

          {/* Brand */}
          <div className="lg:col-span-5 flex flex-col items-start gap-6">
            <LogoStoreName className="h-16" />
            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ fontFamily: 'var(--font-body)', color: '#9C8070' }}
            >
              Premium café di Jakarta menghadirkan donat lumer, mochi pillow,
              dan minuman berkualitas. Dine-in, take away, atau pesan online
              — buka setiap hari 09:00–22:00.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com/ludochi.id"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: '#E8D5B0', color: '#6B3A1F' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#6B3A1F';
                  (e.currentTarget as HTMLElement).style.color = '#FFFAF4';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#E8D5B0';
                  (e.currentTarget as HTMLElement).style.color = '#6B3A1F';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="mailto:order@ludochi.id"
                aria-label="Email"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: '#E8D5B0', color: '#6B3A1F' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#6B3A1F';
                  (e.currentTarget as HTMLElement).style.color = '#FFFAF4';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#E8D5B0';
                  (e.currentTarget as HTMLElement).style.color = '#6B3A1F';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16v12H4z" /><polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1" />

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h4
              className="mb-6 text-sm font-bold uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-label)', color: '#C47C3A' }}
            >
              Menu
            </h4>
            <nav className="flex flex-col gap-3">
              {footerNavigationItems?.map(({ id, new_tab, ...navItemProps }) => (
                <URLAwareNavLink
                  key={id}
                  {...navItemProps}
                  newTab={new_tab}
                  className="text-base font-semibold hover:text-[#6B3A1F] transition-colors duration-200 w-fit"
                  style={{ fontFamily: 'var(--font-body)', color: '#3D2B1F' }}
                  prefetch="viewport"
                >
                  {navItemProps.label}
                </URLAwareNavLink>
              ))}
            </nav>
          </div>

          {/* Newsletter + Address */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <div>
              <h4
                className="mb-6 text-sm font-bold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-label)', color: '#C47C3A' }}
              >
                Newsletter
              </h4>
              <NewsletterSubscription className="w-full" />
            </div>

            <div>
              <h4
                className="text-lg font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
              >
                Lokasi Kami
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: '#9C8070' }}
              >
                Jakarta, Indonesia<br />
                Buka Setiap Hari, 09:00 – 22:00
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="flex flex-col md:flex-row items-center gap-4 text-xs font-semibold uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-label)', color: '#9C8070' }}
          >
            <p>© {new Date().getFullYear()} LuDo-Chi • ドーナツと餅パン</p>
            <span className="hidden md:block w-px h-3 bg-[#E2CCB0]" />
            <a href="#" className="hover:text-[#6B3A1F] transition-colors duration-200">Privacy Policy</a>
            <span className="hidden md:block w-px h-3 bg-[#E2CCB0]" />
            <a href="#" className="hover:text-[#6B3A1F] transition-colors duration-200">Terms &amp; Conditions</a>
          </div>

          <div className="flex items-center gap-4">
            <Select
              className="text-xs font-semibold uppercase tracking-widest border-2 rounded-xl bg-white shadow-none focus:border-[#C47C3A] px-4 py-2 min-w-[140px]"
              style={{ borderColor: '#E2CCB0', color: '#9C8070' }}
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
