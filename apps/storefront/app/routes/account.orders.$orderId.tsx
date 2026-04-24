import { getCustomer } from '@libs/util/server/data/customer.server';
import { retrieveOrder } from '@libs/util/server/data/orders.server';
import { formatPrice } from '@libs/util/prices';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { data, Link, redirect, useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Detail Pesanan — LuDo-Chi' }];

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  pending:         { label: 'Menunggu Pembayaran', bg: '#FFF3E4', color: '#C47C3A' },
  processing:      { label: 'Sedang Diproses',    bg: '#F5EDE0', color: '#6B3A1F' },
  completed:       { label: 'Selesai',            bg: '#E8F0E8', color: '#3A5C3A' },
  cancelled:       { label: 'Dibatalkan',         bg: '#FEF2F2', color: '#B91C1C' },
  requires_action: { label: 'Perlu Tindakan',     bg: '#FFF3E4', color: '#9A4A00' },
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const customer = await getCustomer(request);
  if (!customer) return redirect('/account/login');
  const order = await retrieveOrder(request, params.orderId!).catch(() => null);
  if (!order) throw redirect('/account/orders');
  return data({ order });
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}>
    {children}
  </p>
);

export default function OrderDetailPage() {
  const { order } = useLoaderData<typeof loader>();
  const status    = STATUS_MAP[order.status] ?? { label: order.status, bg: '#FFF3E4', color: '#6B3A1F' };
  const date      = new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const curr      = order.currency_code;
  const address   = order.shipping_address;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FFFAF4' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5" style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}>
        <Link to="/account/orders" className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(255,250,244,0.15)' }}>
          <ArrowLeftIcon className="w-4 h-4" style={{ color: '#FFFAF4' }} />
        </Link>
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,250,244,0.55)', fontFamily: 'var(--font-label)' }}>
            Pesanan #{order.display_id}
          </p>
          <h1 className="text-lg font-semibold" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>Detail Pesanan</h1>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-3">

        {/* Status */}
        <div className="rounded-2xl px-4 py-4 flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
          <div>
            <p className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>{date}</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>Status Pesanan</p>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: status.bg, color: status.color, fontFamily: 'var(--font-label)' }}>
            {status.label}
          </span>
        </div>

        {/* Items */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
          <div className="px-4 pt-4 pb-1">
            <SectionTitle>Item Pesanan</SectionTitle>
          </div>
          <div>
            {order.items?.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? '1px solid #F5EDE0' : undefined }}
              >
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" style={{ backgroundColor: '#F5EDE0' }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>{item.title}</p>
                  {item.variant_title && item.variant_title !== 'Default' && (
                    <p className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>{item.variant_title}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold" style={{ color: '#C47C3A', fontFamily: 'var(--font-display)' }}>
                    {formatPrice(item.unit_price, { currency: curr })}
                  </p>
                  <p className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>×{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan harga */}
        <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
          <SectionTitle>Ringkasan Harga</SectionTitle>
          <div className="space-y-2">
            {[
              { label: 'Subtotal',   value: formatPrice(order.item_subtotal ?? 0, { currency: curr }) },
              { label: 'Pengiriman', value: formatPrice(order.shipping_total  ?? 0, { currency: curr }) },
              order.discount_total ? { label: 'Diskon', value: `−${formatPrice(order.discount_total, { currency: curr })}` } : null,
            ].filter(Boolean).map((row) => (
              <div key={row!.label} className="flex justify-between text-sm">
                <span style={{ color: '#7A5C4E', fontFamily: 'var(--font-body)' }}>{row!.label}</span>
                <span style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>{row!.value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3 mt-2" style={{ borderTop: '1px dashed #E2CCB0' }}>
            <span className="text-sm font-semibold" style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>Total</span>
            <span className="text-base font-bold" style={{ color: '#C47C3A', fontFamily: 'var(--font-display)' }}>
              {formatPrice(order.total, { currency: curr })}
            </span>
          </div>
        </div>

        {/* Alamat pengiriman */}
        {address && (
          <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPinIcon className="w-4 h-4" style={{ color: '#C47C3A' }} />
              <SectionTitle>Alamat Pengiriman</SectionTitle>
            </div>
            <p className="text-sm font-medium" style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>
              {[address.first_name, address.last_name].filter(Boolean).join(' ')}
            </p>
            <p className="text-sm mt-0.5 leading-relaxed" style={{ color: '#7A5C4E', fontFamily: 'var(--font-body)' }}>
              {[address.address_1, address.address_2, address.city, address.province, address.postal_code].filter(Boolean).join(', ')}
            </p>
            {address.phone && (
              <p className="text-sm mt-0.5" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>{address.phone}</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
