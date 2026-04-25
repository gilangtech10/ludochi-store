import { getCustomer } from '@libs/util/server/data/customer.server';
import { listOrders } from '@libs/util/server/data/orders.server';
import { formatCartSubtotal, formatPrice } from '@libs/util/prices';
import { useCart } from '@app/hooks/useCart';
import { useRegion } from '@app/hooks/useRegion';
import { CartDrawerItem } from '@app/components/cart/CartDrawerItem';
import {
  ShoppingBagIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { data, Link, useLoaderData, useNavigate, useFetchers } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

export const meta: MetaFunction = () => [{ title: 'Pesanan — LuDo-Chi' }];

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  pending:         { label: 'Menunggu',    bg: '#FFF3E4', color: '#C47C3A' },
  processing:      { label: 'Diproses',   bg: '#F5EDE0', color: '#6B3A1F' },
  completed:       { label: 'Selesai',    bg: '#E8F0E8', color: '#3A5C3A' },
  cancelled:       { label: 'Dibatalkan', bg: '#FEF2F2', color: '#B91C1C' },
  requires_action: { label: 'Perlu Aksi', bg: '#FFF3E4', color: '#9A4A00' },
};

type OrderType = 'takeaway' | 'dinein';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const customer = await getCustomer(request).catch(() => null);
  const orders = customer
    ? await listOrders(request, 5, 0).catch(() => [])
    : [];
  return data({ customer, orders });
};

export default function OrderPage() {
  const { customer, orders } = useLoaderData<typeof loader>();
  const { cart, isRemovingItemId } = useCart();
  const { region } = useRegion();
  const navigate = useNavigate();
  const allFetchers = useFetchers();

  const [orderType, setOrderType] = useState<OrderType>('takeaway');
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ludochi_order_type') as OrderType | null;
    if (saved === 'takeaway' || saved === 'dinein') setOrderType(saved);
  }, []);

  const selectOrderType = useCallback((type: OrderType) => {
    setOrderType(type);
    localStorage.setItem('ludochi_order_type', type);
  }, []);

  const isCartLoading = allFetchers.some(
    (f) => (f.state === 'submitting' || f.state === 'loading') && f.key.startsWith('cart:'),
  );

  const lineItems = cart?.items ?? [];
  const hasItems = lineItems.length > 0;

  const handleCheckout = useCallback(() => {
    setNavigating(true);
    navigate('/checkout');
  }, [navigate]);

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#FFFAF4' }}>

      {/* ── Header ── */}
      <div
        className="relative overflow-hidden px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}
      >
        <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-10" style={{ backgroundColor: '#E8D5B0' }} />
        <div aria-hidden className="pointer-events-none absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: '#E8D5B0' }} />
        <p
          className="text-[9px] tracking-[0.3em] uppercase mb-1 relative"
          style={{ color: 'rgba(232,213,176,0.55)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
        >
          ご注文
        </p>
        <h1
          className="text-2xl relative"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#FFFAF4' }}
        >
          Pesanan
        </h1>
      </div>

      <div className="px-5 pt-5 space-y-5">

        {/* ── Order Type Selector ── */}
        <div>
          <p
            className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-2"
            style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}
          >
            Tipe Pesanan
          </p>
          <div
            className="flex gap-2 rounded-2xl p-1.5"
            style={{ backgroundColor: '#F0E6D6' }}
          >
            {([
              { id: 'takeaway' as OrderType, label: 'Take Away', kana: 'テイクアウト' },
              { id: 'dinein'   as OrderType, label: 'Dine In',   kana: 'お食事' },
            ] as const).map((opt) => {
              const active = orderType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOrderType(opt.id)}
                  className="flex-1 py-2.5 rounded-xl flex flex-col items-center gap-0.5 transition-all duration-200 active:scale-[0.97]"
                  style={{
                    backgroundColor: active ? '#3D2B1F' : 'transparent',
                    boxShadow: active ? '0 2px 8px rgba(61,43,31,0.18)' : 'none',
                  }}
                >
                  <span
                    className="text-[9px] tracking-wider"
                    style={{
                      color: active ? 'rgba(255,250,244,0.5)' : '#B8A090',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {opt.kana}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: active ? '#FFFAF4' : '#6B3A1F',
                      fontFamily: 'var(--font-label)',
                    }}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Cart Items ── */}
        <div>
          <p
            className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-3"
            style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}
          >
            Item Pesanan
          </p>

          {!hasItems && !isCartLoading ? (
            <div
              className="rounded-2xl flex flex-col items-center py-12 text-center"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: '#FFF3E4' }}
              >
                <ShoppingBagIcon className="w-6 h-6" style={{ color: '#C4A882' }} />
              </div>
              <p
                className="text-sm mb-1"
                style={{ color: '#3D2B1F', fontFamily: 'var(--font-display)', fontWeight: 500 }}
              >
                Belum ada item
              </p>
              <p
                className="text-xs mb-5"
                style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}
              >
                Tambahkan produk dari menu
              </p>
              <Link
                to="/products"
                className="px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                style={{ backgroundColor: '#6B3A1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
              >
                Lihat Menu <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}
            >
              <ul className="list-none divide-y" style={{ borderColor: '#F0E6D6' }}>
                {lineItems.map((item) => (
                  <CartDrawerItem
                    key={item.id}
                    item={item}
                    currencyCode={region.currency_code}
                    isRemoving={isRemovingItemId === item.id}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Subtotal + CTA ── */}
        {hasItems && (
          <div
            className="rounded-2xl px-4 py-4"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}
          >
            <div className="flex items-end justify-between mb-4">
              <div>
                <p
                  className="text-[9px] tracking-[0.25em] uppercase mb-0.5"
                  style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
                >
                  Total Pesanan
                </p>
                <p
                  className="text-xs"
                  style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}
                >
                  Belum termasuk ongkos kirim
                </p>
              </div>
              <p
                className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
              >
                {cart
                  ? formatCartSubtotal(cart)
                  : formatPrice(0, { currency: region.currency_code })}
              </p>
            </div>

            <button
              disabled={navigating}
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                backgroundColor: '#3D2B1F',
                color: '#FFFAF4',
                fontFamily: 'var(--font-label)',
                boxShadow: '0 4px 14px rgba(61,43,31,0.25)',
              }}
            >
              {navigating ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(255,250,244,0.35)', borderTopColor: '#FFFAF4' }}
                  />
                  Memproses…
                </>
              ) : (
                <>
                  Pesan Sekarang
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Riwayat Pesanan ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5" style={{ color: '#C47C3A' }} />
              <p
                className="text-[9px] tracking-[0.2em] uppercase font-semibold"
                style={{ color: '#9C8070', fontFamily: 'var(--font-label)' }}
              >
                Riwayat Pesanan
              </p>
            </div>
            {customer && orders.length > 0 && (
              <Link
                to="/account/orders"
                className="text-xs font-semibold"
                style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
              >
                Lihat Semua →
              </Link>
            )}
          </div>

          {!customer ? (
            <div
              className="rounded-2xl px-4 py-5 flex items-center gap-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FFF3E4' }}
              >
                <ClockIcon className="w-5 h-5" style={{ color: '#C4A882' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium mb-0.5"
                  style={{ color: '#3D2B1F', fontFamily: 'var(--font-display)' }}
                >
                  Login untuk melihat riwayat
                </p>
                <p
                  className="text-xs"
                  style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}
                >
                  Pantau status pesanan kamu
                </p>
              </div>
              <Link
                to="/account/login"
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ backgroundColor: '#3D2B1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
              >
                Login
              </Link>
            </div>
          ) : orders.length === 0 ? (
            <div
              className="rounded-2xl flex flex-col items-center py-10 text-center"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0E6D6' }}
            >
              <p
                className="text-sm"
                style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}
              >
                Belum ada pesanan sebelumnya
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => {
                const status = STATUS_MAP[order.status] ?? { label: order.status, bg: '#FFF3E4', color: '#6B3A1F' };
                const date   = new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                const total  = formatPrice(order.total, { currency: order.currency_code });

                return (
                  <Link
                    key={order.id}
                    to={`/account/orders/${order.id}`}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #F0E6D6',
                      boxShadow: '0 1px 4px rgba(61,43,31,0.05)',
                    }}
                  >
                    {order.items?.[0]?.thumbnail ? (
                      <img
                        src={order.items[0].thumbnail}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                        style={{ backgroundColor: '#F5EDE0' }}
                      />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: '#FFF3E4' }}
                      >
                        <ShoppingBagIcon className="w-5 h-5" style={{ color: '#C4A882' }} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}
                        >
                          #{order.display_id}
                        </p>
                        <span
                          className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: status.bg, color: status.color, fontFamily: 'var(--font-label)' }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className="text-xs"
                          style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}
                        >
                          {order.items?.length ?? 0} item · {date}
                        </p>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: '#C47C3A', fontFamily: 'var(--font-display)' }}
                        >
                          {total}
                        </p>
                      </div>
                    </div>

                    <ChevronRightIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#C4A882' }} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
