import { Container } from '@app/components/common/container';
import Hero from '@app/components/sections/Hero';
import { getMergedPageMeta } from '@libs/util/page';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

const locations: LocationProps[] = [
  {
    title: 'LuDo-Chi South Lamar',
    addressLines: ['1105 S. Lamar Blvd', 'Austin, TX 78704'],
    phone: '(512) 906-0010',
    hours: ['Open Daily — 7am to 7pm'],
    imageUrl: '/assets/images/location-1.png',
  },
  {
    title: 'LuDo-Chi Sonterra',
    addressLines: ['700 E. Sonterra Blvd. Suite #1113', 'San Antonio, TX 78258'],
    phone: '(210) 530-8740',
    hours: ['Mon thru Fri — 6am to 7pm', 'Sat — 7am to 7pm', 'Sun — 7am to 6pm'],
    imageUrl: '/assets/images/location-2.png',
  },
  {
    title: 'LuDo-Chi Deep Ellum',
    addressLines: ['2369 Main Street', 'Dallas, TX 75226'],
    phone: '(469) 248-3440',
    hours: ['Sun thru Thu — 7am to 7pm', 'Fri thru Sat — 7am to 8pm'],
    imageUrl: '/assets/images/location-3.png',
  },
];

export const loader = async (args: LoaderFunctionArgs) => {
  return {};
};

export const meta: MetaFunction<typeof loader> = getMergedPageMeta;

type LocationProps = {
  title: string;
  hours: string[];
  phone: string;
  addressLines: string[];
  imageUrl: string;
};

const Location = ({ title, addressLines, phone, hours, imageUrl }: LocationProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 text-lg border-b border-[#2C1E16]/10 pb-16 last:border-0">
      <div className="w-full h-full flex items-center justify-center col-span-2 group">
        <div
          className="bg-cover bg-no-repeat bg-center w-full rounded-none border border-[#2C1E16] h-80 grayscale-[30%] sepia-[20%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />
      </div>

      <div className="flex flex-col gap-6 col-span-1 md:justify-center">
        <h3 className="text-3xl font-display font-medium italic text-[#2C1E16]">{title}</h3>
        <div className="font-body text-[#2C1E16]/80 leading-relaxed">
          {addressLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          <p className="mt-2 text-[#B0894A] font-medium tracking-wide">p. {phone}</p>
        </div>
        <div className="font-body text-[#2C1E16]/80">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B0894A] mb-2">Jam Buka</h4>
          {hours.map((hour, i) => (
            <p key={i} className="leading-relaxed">{hour}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function IndexRoute() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#2C1E16] selection:bg-[#B0894A] selection:text-[#F5F2EB] relative pt-12 xl:pt-24 pb-24">
      {/* Global Paper Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div className="relative z-10">
        <Container className="!px-0 py-0 sm:!p-0 mb-16">
          <Hero
            className="min-h-[400px] !max-w-full !bg-transparent border-y border-[#2C1E16]/20 sm:rounded-none p-6 sm:p-10 md:p-[88px] md:px-[88px]"
            content={
              <div className="text-center w-full space-y-9 max-w-4xl mx-auto">
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#B0894A]">Tentang Kami</h4>
                <h1 className="text-5xl md:text-7xl font-display italic text-[#2C1E16] tracking-tight">
                  Cerita Kami
                </h1>
                <p className="mx-auto text-lg md:text-xl font-body italic text-[#2C1E16]/80 !leading-relaxed">
                  Di LuDo-Chi, kami bukan sekadar toko permen cokelat mentega kacang — kami adalah sebuah komunitas yang hangat.
                  Terinspirasi dari nuansa "LuDo-Chi" itu sendiri, sebuah lingkungan erat berlandaskan rasa kebersamaan
                  dan silaturahmi, kami menyajikan rasa tersebut dalam tiap piring sajian manis yang kami panggang.
                  Mulai dari masa lampau, semangat kami satu: meracik keajaiban rasawi yang bakal{' '}
                  <span className="font-bold text-[#2C1E16]">menyatukan manusia, sedap per lahapannya.</span>
                </p>
              </div>
            }
            actionsClassName="!flex-row w-full justify-center !font-display !italic mt-8 hidden"
            actions={[]}
          />
        </Container>

        <Container className="pt-4 flex flex-col gap-16 py-0 sm:!px-16 pb-20">
          <div className="font-display italic text-4xl md:text-6xl text-center text-[#2C1E16] pb-10 border-b border-[#2C1E16]/20">
            Temukan Komunitasmu, Temukan <span className="font-display italic font-bold text-[#B0894A]">LuDo-Chi</span>-mu
          </div>
          {locations.map((location, i) => (
            <Location key={i} {...location} />
          ))}
        </Container>
      </div>
    </div>
  );
}
