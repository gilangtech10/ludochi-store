import { Image } from '@app/components/common/images/Image';
import { formatPhoneNumber } from '@libs/util/phoneNumber';
import { formatPrice } from '@libs/util/prices';
import { retrieveOrder } from '@libs/util/server/data/orders.server';
import { StoreOrder } from '@medusajs/types';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import { motion, Variants } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const loader = async ({ request }: LoaderFunctionArgs): Promise<{ order: StoreOrder }> => {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('order_id') || '';
  if (!orderId) throw redirect('/');
  const order = await retrieveOrder(request, orderId);
  return { order };
};

export default function CheckoutSuccessRoute() {
  const { order } = useLoaderData<typeof loader>();
  const discountTotal = order.discount_total || 0;

  const {
    shipping_address: shippingAddress,
    billing_address: billingAddress,
    shipping_methods: shippingMethods,
  } = order as StoreOrder;

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFAF4', color: '#3D2B1F' }}>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-5 pt-8 pb-20"
      >

        {/* ── Success header ── */}
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-2xl px-5 pt-6 pb-5 mb-6"
          style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
            style={{ backgroundColor: '#E8D5B0' }}
          />
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: 'rgba(232,213,176,0.15)', border: '1px solid rgba(232,213,176,0.25)' }}
            >
              <CheckCircleIcon className="w-5 h-5" style={{ color: '#E8D5B0' }} />
            </div>
            <div>
              <p
                className="text-[9px] tracking-[0.3em] uppercase mb-1"
                style={{ color: 'rgba(232,213,176,0.55)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
              >
                ご注文ありがとうございます
              </p>
              <h1
                className="text-xl leading-snug"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#FFFAF4' }}
              >
                Pesanan Diterima!
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'rgba(255,250,244,0.5)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
              >
                Pesanan kamu sedang kami proses
              </p>
            </div>
          </div>
          <div
            className="mt-4 px-3 py-2 rounded-xl inline-flex items-center gap-1.5"
            style={{ backgroundColor: 'rgba(255,250,244,0.08)', border: '1px solid rgba(255,250,244,0.12)' }}
          >
            <span
              className="text-[9px] tracking-[0.15em] uppercase"
              style={{ color: 'rgba(232,213,176,0.55)', fontFamily: 'var(--font-label)' }}
            >
              No. Pesanan
            </span>
            <span
              className="text-[11px] font-semibold truncate max-w-[200px]"
              style={{ color: '#E8D5B0', fontFamily: 'var(--font-body)' }}
            >
              {order.id}
            </span>
          </div>
        </motion.div>

        {/* ── Order items ── */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl overflow-hidden mb-4"
          style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #F0E6D6' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F0E6D6' }}>
            <p
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
            >
              Item Pesanan
            </p>
          </div>
          <ul className="divide-y" style={{ borderColor: '#F0E6D6' }}>
            {order.items?.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                {item.thumbnail && (
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: '#FFF3E4', border: '1.5px solid #F0E6D6' }}
                  >
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-snug line-clamp-1"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
                  >
                    {item.product_title}
                  </p>
                  {item.variant_title && (
                    <p className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      {item.variant_title}
                    </p>
                  )}
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: '#6B3A1F', fontFamily: 'var(--font-label)' }}
                  >
                    ×{item.quantity}
                  </p>
                </div>
                <p
                  className="text-sm font-medium flex-shrink-0"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#C47C3A' }}
                >
                  {formatPrice(item.unit_price, { currency: order.currency_code })}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Totals ── */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl overflow-hidden mb-4"
          style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #F0E6D6' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#F0E6D6' }}>
            <p
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
            >
              Rincian Biaya
            </p>
          </div>
          <div className="px-4 py-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>Subtotal</span>
              <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}>
                {formatPrice(order.item_subtotal, { currency: order.currency_code })}
              </span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>Diskon</span>
                <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#6B3A1F' }}>
                  -{formatPrice(discountTotal, { currency: order.currency_code })}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>Ongkos Kirim</span>
              <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}>
                {formatPrice(order.shipping_total, { currency: order.currency_code })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>Pajak</span>
              <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}>
                {formatPrice(order.tax_total, { currency: order.currency_code })}
              </span>
            </div>
            <div
              className="flex justify-between items-center pt-3 mt-1 border-t"
              style={{ borderColor: '#F0E6D6' }}
            >
              <span
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
              >
                Total
              </span>
              <span
                className="text-xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
              >
                {formatPrice(order.total, { currency: order.currency_code })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Shipping info ── */}
        {(!!shippingAddress || !!shippingMethods?.length) && (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl overflow-hidden mb-6"
            style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #F0E6D6' }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: '#F0E6D6' }}>
              <p
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
              >
                Info Pengiriman
              </p>
            </div>
            <div className="px-4 py-4 space-y-3">
              {!!shippingAddress && (
                <div>
                  <p className="text-xs mb-1" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>Alamat</p>
                  <address className="not-italic text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: '#3D2B1F' }}>
                    <span className="font-semibold">{shippingAddress.first_name} {shippingAddress.last_name}</span><br />
                    {shippingAddress.address_1}{shippingAddress.address_2 && `, ${shippingAddress.address_2}`}<br />
                    {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postal_code}<br />
                    <span className="uppercase">{shippingAddress.country_code}</span>
                    {shippingAddress.phone && (
                      <><br /><span style={{ color: '#C47C3A' }}>{formatPhoneNumber(shippingAddress.phone)}</span></>
                    )}
                  </address>
                </div>
              )}
              {!!shippingMethods?.length && (
                <div>
                  <p className="text-xs mb-1" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>Metode Pengiriman</p>
                  {shippingMethods.map((sm) => (
                    <p key={sm.id} className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#3D2B1F' }}>
                      {sm.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── CTA ── */}
        <motion.div variants={fadeUp}>
          <Link
            to="/products"
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: '#3D2B1F',
              color: '#FFFAF4',
              fontFamily: 'var(--font-label)',
              boxShadow: '0 4px 14px rgba(61,43,31,0.2)',
            }}
          >
            Pesan Lagi <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
