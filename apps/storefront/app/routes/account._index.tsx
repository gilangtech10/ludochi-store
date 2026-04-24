import { getCustomer } from '@libs/util/server/data/customer.server';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  MapPinIcon,
  TagIcon,
  WalletIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { data, Form, Link, redirect, useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Akun Saya — LuDo-Chi' }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customer = await getCustomer(request);
  if (!customer) return redirect('/account/login');
  return data({ customer });
};

const MENU_ITEMS = [
  { icon: ShoppingBagIcon, label: 'Pesanan Saya',    desc: 'Riwayat & status pesanan',        href: '/account/orders'    },
  { icon: UserCircleIcon,  label: 'Profil',           desc: 'Nama, email, & nomor HP',          href: '/account/profile'   },
  { icon: MapPinIcon,      label: 'Alamat',           desc: 'Kelola alamat pengiriman',          href: '/account/addresses' },
  { icon: TagIcon,         label: 'Voucher',          desc: 'Kode promo & redeem voucher',       href: '/account/vouchers'  },
];

export default function AccountPage() {
  const { customer } = useLoaderData<typeof loader>();
  const displayName = [customer.first_name, customer.last_name].filter(Boolean).join(' ') || customer.email;
  const initials    = (customer.first_name?.[0] ?? customer.email[0]).toUpperCase();

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FFFAF4' }}>

      {/* ── Header ── */}
      <div
        className="px-5 pt-12 pb-8"
        style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,250,244,0.15)', border: '1.5px solid rgba(255,250,244,0.2)' }}
          >
            <span className="text-xl font-bold" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold truncate" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>
              {displayName}
            </p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,250,244,0.60)', fontFamily: 'var(--font-body)' }}>
              {customer.email}
            </p>
          </div>
        </div>
      </div>

      {/* ── Saldo LuDo-Chi ── */}
      <div className="px-5 -mt-4">
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, #C47C3A 0%, #A0581C 100%)',
            boxShadow: '0 6px 24px rgba(100,58,31,0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <WalletIcon className="w-7 h-7 flex-shrink-0" style={{ color: '#FFFAF4' }} />
            <div>
              <p
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(255,250,244,0.70)', fontFamily: 'var(--font-label)' }}
              >
                Saldo LuDo-Chi
              </p>
              <p className="text-xl font-bold" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>
                Segera Hadir
              </p>
            </div>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide"
            style={{ backgroundColor: 'rgba(255,250,244,0.20)', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
          >
            COMING SOON
          </span>
        </div>
      </div>

      {/* ── Menu ── */}
      <div className="px-5 mt-5 space-y-2.5">
        {MENU_ITEMS.map(({ icon: Icon, label, desc, href }) => (
          <Link
            key={href}
            to={href}
            className="flex items-center gap-4 rounded-2xl px-4 py-4 transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6', boxShadow: '0 1px 4px rgba(61,43,31,0.05)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FFF3E4' }}
            >
              <Icon className="w-5 h-5" style={{ color: '#C47C3A' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>
                {label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>
                {desc}
              </p>
            </div>
            <ChevronRightIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#C4A882' }} />
          </Link>
        ))}
      </div>

      {/* ── Keluar ── */}
      <div className="px-5 mt-4">
        <Form method="post" action="/api/auth/logout">
          <button
            type="submit"
            className="w-full flex items-center gap-4 rounded-2xl px-4 py-4 transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEF2F2' }}>
              <ArrowRightOnRectangleIcon className="w-5 h-5" style={{ color: '#B91C1C' }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: '#B91C1C', fontFamily: 'var(--font-body)' }}>
              Keluar
            </span>
          </button>
        </Form>
      </div>

    </div>
  );
}
