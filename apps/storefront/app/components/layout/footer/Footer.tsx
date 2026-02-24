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
import clsx from 'clsx';
import { useMemo } from 'react';
import { useFetcher } from 'react-router';
import { StripeSecurityImage } from '../../images/StripeSecurityImage';
import { SocialIcons } from './SocialIcons';

export const Footer = () => {
  const { footerNavigationItems, settings } = useSiteDetails();
  const rootData = useRootLoaderData();
  const hasProducts = rootData?.hasPublishedProducts;
  const fetcher = useFetcher();
  const { regions } = useRegions();
  const { region } = useRegion();

  const regionOptions = useMemo(() => {
    return regions.map((region) => ({
      label: `${region.name} (${region.currency_code})`,
      value: region.id,
    }));
  }, [regions]);

  const onRegionChange = (regionId: string) => {
    fetcher.submit(
      convertToFormData({
        regionId,
      }),
      { method: 'post', action: '/api/region' },
    );
  };

  return (
    <footer className="bg-[#2C1E16] text-[#F5F2EB] py-20 lg:py-24 border-t-4 border-double border-[#B0894A]/40 relative overflow-hidden">
      {/* Subtle Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <Container className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

        {/* Top Editorial Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 pb-20 border-b border-[#B0894A]/30">

          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col items-start gap-8">
            <h3 className="font-display text-4xl font-medium tracking-wide italic text-[#F5F2EB]">LuDo-Chi<br /><span className="text-[#B0894A]">Bakery</span></h3>
            <p className="text-[#F5F2EB]/80 text-lg leading-relaxed max-w-sm font-body">
              Resep klasik khas Jepang yang menyajikan kehangatan lokal. Manis, kenyal, dan selalu segar setiap subuh.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://instagram.com" className="w-10 h-10 border border-[#B0894A]/50 flex items-center justify-center hover:bg-[#B0894A] hover:border-[#B0894A] hover:text-[#2C1E16] transition-colors rounded-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="2" y="2" width="20" height="20" rx="0" ry="0"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="mailto:hello@ludochi.com" className="w-10 h-10 border border-[#B0894A]/50 flex items-center justify-center hover:bg-[#B0894A] hover:border-[#B0894A] hover:text-[#2C1E16] transition-colors rounded-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M4 4h16v12H4z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1" />

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B0894A] mb-8 border-b border-[#B0894A]/30 pb-4">Indeks</h4>
            <nav className="flex flex-col gap-4">
              {footerNavigationItems?.map(({ id, new_tab, ...navItemProps }) => (
                <URLAwareNavLink
                  key={id}
                  {...navItemProps}
                  newTab={new_tab}
                  className="font-display font-medium italic text-lg hover:text-[#B0894A] transition-colors w-fit"
                  prefetch="viewport"
                >
                  {navItemProps.label}
                </URLAwareNavLink>
              ))}
            </nav>
          </div>

          {/* Location & Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B0894A] mb-8 border-b border-[#B0894A]/30 pb-4">Korespondensi</h4>
              <NewsletterSubscription className="w-full" />
            </div>

            <div className="pt-4">
              <h4 className="font-display font-medium italic text-xl mb-4 text-[#F5F2EB]">Lokasi Pusat</h4>
              <p className="text-[#F5F2EB]/80 text-sm leading-relaxed font-body">
                Jl. Kenangan Manis No. 99<br />
                Jakarta Selatan, 12345<br />
                Buka Tiap Hari, 08:00 - 22:00
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs tracking-widest uppercase text-[#F5F2EB]/50">
            <p>© {new Date().getFullYear()} LuDo-Chi</p>
            <span className="hidden md:block w-px h-3 bg-[#B0894A]/50" />
            <a href="#" className="hover:text-[#B0894A] transition-colors">Kebijakan Privasi</a>
            <span className="hidden md:block w-px h-3 bg-[#B0894A]/50" />
            <a href="#" className="hover:text-[#B0894A] transition-colors">Syarat & Ketentuan</a>
          </div>

          <div className="flex items-center gap-6">
            <Select
              className="!text-xs uppercase tracking-[0.2em] border border-[#B0894A]/50 rounded-none text-[#F5F2EB] bg-transparent !shadow-none focus:border-[#B0894A] px-4 py-2 min-w-[140px]"
              options={regionOptions}
              defaultValue={region?.id}
              onChange={(e) => {
                onRegionChange(e.target.value);
              }}
            />
          </div>
        </div>

      </Container>
    </footer>
  );
};
