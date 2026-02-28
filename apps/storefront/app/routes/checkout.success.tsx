import { ButtonLink } from '@app/components/common/buttons/ButtonLink';
import { Container } from '@app/components/common/container/Container';
import { Image } from '@app/components/common/images/Image';
import { formatPhoneNumber } from '@libs/util/phoneNumber';
import { formatPrice } from '@libs/util/prices';
import { retrieveOrder } from '@libs/util/server/data/orders.server';
import { StoreOrder, StorePaymentCollection } from '@medusajs/types';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { Link, useLoaderData } from 'react-router';

const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const loader = async ({ request }: LoaderFunctionArgs): Promise<{ order: StoreOrder }> => {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('order_id') || '';
  if (!orderId) throw redirect('/');
  const order = await retrieveOrder(request, orderId);
  return { order };
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <dt
    style={{
      fontFamily: 'var(--font-label)',
      fontSize: '0.6rem',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: '#C9A962',
    }}
  >
    {children}
  </dt>
);

const SectionValue: React.FC<{ children: React.ReactNode; large?: boolean }> = ({ children, large }) => (
  <dd
    style={{
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: large ? '1.4rem' : '1.15rem',
      color: large ? '#C9A962' : '#E8DFD4',
    }}
  >
    {children}
  </dd>
);

export default function CheckoutSuccessRoute() {
  const { order } = useLoaderData<typeof loader>();
  const discountTotal = order.discount_total || 0;

  const {
    shipping_address: shippingAddress,
    billing_address: billingAddress,
    shipping_methods: shippingMethods,
  } = order as StoreOrder;

  return (
    <section
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

      <Container className="!max-w-3xl relative z-10 py-16 md:py-24">

        {/* ── Confirmation header ── */}
        <div
          className="p-8 sm:p-12 lg:p-16 relative"
          style={{ backgroundColor: '#251E19', border: '1px solid #4A3F35' }}
        >
          {/* Corner ornaments */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
            <span key={pos} className={`absolute ${pos} text-[#C9A962] text-xs opacity-40 pointer-events-none`} aria-hidden="true">✦</span>
          ))}

          {/* Badge */}
          <div className="academia-label mb-6">Order Received</div>

          <h1
            className="text-5xl md:text-6xl mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
          >
            Thank You
          </h1>

          <p
            className="italic leading-relaxed max-w-md mb-2"
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.7)' }}
          >
            Your order has been received and is now being curated with care.
            We shall dispatch it presently.
          </p>

          {/* Order number */}
          <p
            className="mt-4"
            style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9C8B7A' }}
          >
            Reference&nbsp;·&nbsp;{order.id}
          </p>

          {/* ── Order items ── */}
          <ul
            role="list"
            className="mt-10"
            style={{ borderTop: '1px solid #4A3F35' }}
          >
            {order.items?.map((item) => (
              <li
                key={item.id}
                className="flex space-x-6 py-6"
                style={{ borderBottom: '1px solid rgba(74,63,53,0.5)' }}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-24 w-24 flex-none object-cover object-center sepia-aged"
                    style={{ border: '1px solid #4A3F35' }}
                  />
                )}
                <div className="flex flex-auto flex-col space-y-1 justify-center">
                  <div>
                    <h3
                      className="leading-tight"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.15rem', color: '#E8DFD4' }}
                    >
                      <Link
                        to={`/products/${item.product_handle}`}
                        className="transition-colors"
                        style={{ color: 'inherit' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C9A962')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#E8DFD4')}
                      >
                        {item.product_title}
                      </Link>
                    </h3>
                    <p
                      className="mt-1 italic text-sm"
                      style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}
                    >
                      {item.variant_title}
                    </p>
                  </div>
                  <div className="flex items-end mt-2">
                    <span className="academia-label">Qty {item.quantity}</span>
                  </div>
                </div>
                <p className="flex-none flex items-center" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.2rem', color: '#C9A962' }}>
                  {formatPrice(item.unit_price, { currency: order.currency_code })}
                </p>
              </li>
            ))}
          </ul>

          {/* ── Totals ── */}
          <dl className="flex flex-col gap-4 pt-6 mt-2" style={{ borderTop: '1px solid #4A3F35' }}>
            <div className="flex justify-between items-end">
              <SectionLabel>Subtotal</SectionLabel>
              <SectionValue>{formatPrice(order.item_subtotal, { currency: order.currency_code })}</SectionValue>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between items-end">
                <SectionLabel>Discount</SectionLabel>
                <SectionValue>{formatPrice(-discountTotal, { currency: order.currency_code })}</SectionValue>
              </div>
            )}
            <div className="flex justify-between items-end">
              <SectionLabel>Shipping</SectionLabel>
              <SectionValue>{formatPrice(order.shipping_total, { currency: order.currency_code })}</SectionValue>
            </div>
            <div className="flex justify-between items-end">
              <SectionLabel>Tax</SectionLabel>
              <SectionValue>{formatPrice(order.tax_total, { currency: order.currency_code })}</SectionValue>
            </div>
            <div className="flex items-end justify-between pt-6" style={{ borderTop: '1px solid #4A3F35' }}>
              <SectionLabel>Order Total</SectionLabel>
              <SectionValue large>{formatPrice(order.total, { currency: order.currency_code })}</SectionValue>
            </div>
          </dl>

          {/* ── Addresses ── */}
          <dl className="mt-12 grid grid-cols-2 gap-x-4 pt-12" style={{ borderTop: '1px solid #4A3F35' }}>
            {!!shippingAddress && (
              <div>
                <dt className="academia-label mb-3 block">Shipping Address</dt>
                <dd className="mt-2">
                  <address className="not-italic leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.7)', fontSize: '0.9rem' }}>
                    <span className="block font-bold" style={{ color: '#E8DFD4' }}>{shippingAddress.first_name} {shippingAddress.last_name}</span>
                    <span className="block">{shippingAddress.address_1}</span>
                    {shippingAddress.address_2 && <span className="block">{shippingAddress.address_2}</span>}
                    <span className="block">{shippingAddress.city}, {shippingAddress.province} {shippingAddress.postal_code}</span>
                    <span className="block uppercase">{shippingAddress.country_code}</span>
                    {shippingAddress.phone && <span className="block" style={{ color: '#C9A962' }}>{formatPhoneNumber(shippingAddress.phone)}</span>}
                  </address>
                </dd>
              </div>
            )}
            {!!billingAddress && (
              <div>
                <dt className="academia-label mb-3 block">Billing Address</dt>
                <dd className="mt-2">
                  <address className="not-italic leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.7)', fontSize: '0.9rem' }}>
                    <span className="block font-bold" style={{ color: '#E8DFD4' }}>{billingAddress.first_name} {billingAddress.last_name}</span>
                    <span className="block">{billingAddress.address_1}</span>
                    {billingAddress.address_2 && <span className="block">{billingAddress.address_2}</span>}
                    <span className="block">{billingAddress.city}, {billingAddress.province} {billingAddress.postal_code}</span>
                    <span className="block uppercase">{billingAddress.country_code}</span>
                    {billingAddress.phone && <span className="block">{formatPhoneNumber(billingAddress.phone)}</span>}
                  </address>
                </dd>
              </div>
            )}
          </dl>

          {/* ── Shipping method ── */}
          <dl className="mt-12 grid grid-cols-2 gap-x-4 pt-12" style={{ borderTop: '1px solid #4A3F35' }}>
            <div>
              <dt className="academia-label mb-3 block">Delivery Method</dt>
              {shippingMethods?.map((sm) => (
                <dd
                  key={sm.id}
                  className="mt-2 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'rgba(232,223,212,0.7)' }}
                >
                  {sm.name}
                </dd>
              ))}
            </div>
          </dl>

          {/* ── CTA ── */}
          <div className="mt-16 pt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4" style={{ borderTop: '1px solid #4A3F35' }}>
            <Link
              to={`/orders/${order.id}/reviews`}
              className="btn-brass engraved !h-12 w-full sm:w-auto !px-12 !text-base cursor-pointer inline-flex items-center justify-center"
              style={{ fontFamily: 'var(--font-label)', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.65rem' }}
            >
              ✦ Write a Review
            </Link>
            <ButtonLink
              as={(buttonProps) => <Link to="/products" {...buttonProps} />}
              className="!h-12 w-full sm:w-auto !px-12 !text-base cursor-pointer inline-flex items-center justify-center"
              style={{ fontFamily: 'var(--font-label)', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.65rem', color: '#9C8B7A', border: '1px solid #4A3F35', backgroundColor: 'transparent' }}
            >
              Continue Browsing <span aria-hidden="true" className="ml-2">→</span>
            </ButtonLink>
          </div>

        </div>
      </Container>
    </section>
  );
}
