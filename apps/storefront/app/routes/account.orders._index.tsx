import { getCustomer } from '@libs/util/server/data/customer.server';
import { listOrders } from '@libs/util/server/data/orders.server';
import { formatPrice } from '@libs/util/prices';
import { ArrowLeftIcon, ShoppingBagIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { data, Link, redirect, useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Pesanan Saya — LuDo-Chi' }];

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  pending:         { label: 'Menunggu',    bg: '#FFF3E4', color: '#C47C3A' },
  processing:      { label: 'Diproses',   bg: '#F5EDE0', color: '#6B3A1F' },
  completed:       { label: 'Selesai',    bg: '#E8F0E8', color: '#3A5C3A' },
  cancelled:       { label: 'Dibatalkan', bg: '#FEF2F2', color: '#B91C1C' },
  requires_action: { label: 'Perlu Aksi', bg: '#FFF3E4', color: '#9A4A00' },
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customer = await getCustomer(request);
  if (!customer) return redirect('/account/login');
  const orders = await listOrders(request, 20, 0).catch(() => []);
  return data({ orders });
};

export default function OrdersPage() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FFFAF4' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5" style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}>
        <Link to="/account" className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(255,250,244,0.15)' }}>
          <ArrowLeftIcon className="w-4 h-4" style={{ color: '#FFFAF4' }} />
        </Link>
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,250,244,0.55)', fontFamily: 'var(--font-label)' }}>Akun</p>
          <h1 className="text-lg font-semibold" style={{ color: '#FFFAF4', fontFamily: 'var(--font-display)' }}>Pesanan Saya</h1>
        </div>
      </div>

      <div className="px-5 pt-5">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FFF3E4' }}>
              <ShoppingBagIcon className="w-7 h-7" style={{ color: '#C4A882' }} />
            </div>
            <p className="text-base mb-1" style={{ color: '#3D2B1F', fontFamily: 'var(--font-display)', fontWeight: 500 }}>Belum ada pesanan</p>
            <p className="text-sm mb-6" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>Yuk, pesan donat lumer favoritmu!</p>
            <Link to="/products" className="px-6 py-3 rounded-full text-sm font-semibold" style={{ backgroundColor: '#3D2B1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}>
              Lihat Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const status = STATUS_MAP[order.status] ?? { label: order.status, bg: '#FFF3E4', color: '#6B3A1F' };
              const date   = new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              const total  = formatPrice(order.total, { currency: order.currency_code });

              return (
                <Link
                  key={order.id}
                  to={`/account/orders/${order.id}`}
                  className="flex items-center gap-4 rounded-2xl px-4 py-4 transition-all active:scale-[0.98]"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6', boxShadow: '0 1px 4px rgba(61,43,31,0.05)' }}
                >
                  {order.items?.[0]?.thumbnail ? (
                    <img src={order.items[0].thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" style={{ backgroundColor: '#F5EDE0' }} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#FFF3E4' }}>
                      <ShoppingBagIcon className="w-5 h-5" style={{ color: '#C4A882' }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}>
                        #{order.display_id}
                      </p>
                      <span className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: status.bg, color: status.color, fontFamily: 'var(--font-label)' }}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}>
                      {order.items?.length ?? 0} item · {date}
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: '#C47C3A', fontFamily: 'var(--font-display)' }}>
                      {total}
                    </p>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#C4A882' }} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
