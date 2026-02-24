import { ButtonLink } from '@app/components/common/buttons/ButtonLink';
import { Container } from '@app/components/common/container/Container';
import { Image } from '@app/components/common/images/Image';
import { formatPhoneNumber } from '@libs/util/phoneNumber';
import { formatPrice } from '@libs/util/prices';
import { retrieveOrder } from '@libs/util/server/data/orders.server';
import { StoreOrder, StorePaymentCollection } from '@medusajs/types';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { Link, useLoaderData } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs): Promise<{ order: StoreOrder }> => {
  const url = new URL(request.url);

  const orderId = url.searchParams.get('order_id') || '';

  if (!orderId) {
    throw redirect('/');
  }

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
    <section className="min-h-screen bg-[#F5F2EB] text-[#2C1E16] selection:bg-[#B0894A] selection:text-[#F5F2EB] relative pt-12 pb-24">
      {/* Global Paper Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E")' }}></div>

      <Container className="!max-w-3xl relative z-10">
        <div className="rounded-none border-2 border-[#2C1E16] bg-[#F5F2EB]/50 backdrop-blur-sm shadow-none">
          <div className="p-8 sm:p-12 lg:p-16">
            <h1 className="text-[#B0894A] text-xs uppercase tracking-[0.2em] font-bold">Pembayaran berhasil</h1>
            <p className="mt-4 text-4xl font-display font-medium italic tracking-tight text-[#2C1E16] sm:text-5xl">Terima Kasih</p>
            <p className="mt-4 text-base font-body text-[#2C1E16]/70 leading-relaxed max-w-md">
              Pesananmu sedang dikurasi. Harap bersabar sedetik sementara kami meramu bahan terbaik untukmu!
            </p>

            <ul
              role="list"
              className="mt-10 divide-y divide-[#2C1E16]/20 border-t border-[#2C1E16]/30 text-sm font-bold text-[#2C1E16]/70"
            >
              {order.items?.map((item) => (
                <li key={item.id} className="flex space-x-6 py-6">
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-24 w-24 flex-none rounded-none border border-[#2C1E16] object-cover object-center grayscale-[30%] sepia-[20%]"
                    />
                  )}
                  <div className="flex flex-auto flex-col space-y-1 justify-center">
                    <div>
                      <h3 className="text-xl font-display font-medium text-[#2C1E16] leading-tight">
                        <Link to={`/products/${item.product_handle}`} className="hover:text-[#B0894A] transition-colors">{item.product_title}</Link>
                      </h3>
                      <p className="mt-1 font-body text-sm italic text-[#2C1E16]/70">{item.variant_title}</p>
                    </div>
                    <div className="flex items-end mt-2">
                      <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#B0894A]">Jml {item.quantity}</span>
                    </div>
                  </div>
                  <p className="flex-none font-display font-medium text-xl text-[#2C1E16] flex items-center">
                    {formatPrice(item.unit_price, {
                      currency: order.currency_code,
                    })}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-[#2C1E16]/30 pt-6 text-sm font-bold text-[#2C1E16]/70 mt-6">
              <div className="flex justify-between items-end">
                <dt className="text-xs font-bold uppercase tracking-widest text-[#B0894A]">Subtotal</dt>
                <dd className="font-display font-medium text-xl text-[#2C1E16]">
                  {formatPrice(order.item_subtotal, {
                    currency: order.currency_code,
                  })}
                </dd>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between items-end">
                  <dt className="text-xs font-bold uppercase tracking-widest text-[#B0894A]">Diskon</dt>
                  <dd className="font-display font-medium text-xl text-[#2C1E16]">
                    {formatPrice(-discountTotal, {
                      currency: order.currency_code,
                    })}
                  </dd>
                </div>
              )}

              <div className="flex justify-between items-end">
                <dt className="text-xs font-bold uppercase tracking-widest text-[#B0894A]">Ongkos Kirim</dt>
                <dd className="font-display font-medium text-xl text-[#2C1E16]">
                  {formatPrice(order.shipping_total, {
                    currency: order.currency_code,
                  })}
                </dd>
              </div>

              <div className="flex justify-between items-end">
                <dt className="text-xs font-bold uppercase tracking-widest text-[#B0894A]">Pajak</dt>
                <dd className="font-display font-medium text-xl text-[#2C1E16]">
                  {formatPrice(order.tax_total, {
                    currency: order.currency_code,
                  })}
                </dd>
              </div>

              <div className="flex items-end justify-between border-t border-[#2C1E16]/30 pt-6 mt-4">
                <dt className="text-xs font-bold uppercase tracking-widest text-[#B0894A]">Total Mahar</dt>
                <dd className="font-display font-medium text-2xl text-[#2C1E16]">
                  {formatPrice(order.total, {
                    currency: order.currency_code,
                  })}
                </dd>
              </div>
            </dl>

            <dl className="mt-12 grid grid-cols-2 gap-x-4 border-t border-[#2C1E16]/30 pt-12 text-sm text-[#2C1E16]/80 font-body">
              {!!shippingAddress && (
                <div>
                  <dt className="font-display text-lg text-[#2C1E16] mb-3">Alamat Pengiriman</dt>
                  <dd className="mt-2">
                    <address className="not-italic leading-relaxed">
                      <span className="block font-bold">
                        {shippingAddress.first_name} {shippingAddress.last_name}
                      </span>
                      <span className="block">{shippingAddress.address_1}</span>
                      {shippingAddress.address_2 && <span className="block">{shippingAddress.address_2}</span>}
                      <span className="block">
                        {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postal_code}
                      </span>
                      <span className="block uppercase">{shippingAddress.country_code}</span>
                      {shippingAddress.phone && (
                        <span className="block">{formatPhoneNumber(shippingAddress.phone)}</span>
                      )}
                    </address>
                  </dd>
                </div>
              )}
              {!!billingAddress && (
                <div>
                  <dt className="font-display text-lg text-[#2C1E16] mb-3">Alamat Tagihan</dt>
                  <dd className="mt-2">
                    <address className="not-italic leading-relaxed">
                      <span className="block font-bold">
                        {billingAddress.first_name} {billingAddress.last_name}
                      </span>
                      <span className="block">{billingAddress.address_1}</span>
                      {billingAddress.address_2 && <span className="block">{billingAddress.address_2}</span>}
                      <span className="block">
                        {billingAddress.city}, {billingAddress.province} {billingAddress.postal_code}
                      </span>
                      <span className="block uppercase">{billingAddress.country_code}</span>
                      {billingAddress.phone && <span className="block">{formatPhoneNumber(billingAddress.phone)}</span>}
                    </address>
                  </dd>
                </div>
              )}
            </dl>

            <dl className="mt-12 grid grid-cols-2 gap-x-4 border-t border-[#2C1E16]/30 pt-12 text-sm text-[#2C1E16]/80 font-body">
              <div>
                <dt className="font-display text-lg text-[#2C1E16] mb-3">
                  Metode Pengiriman
                </dt>
                {shippingMethods &&
                  shippingMethods.map((sm) => (
                    <dd key={sm.id} className="mt-2 leading-relaxed">
                      {sm.name}
                    </dd>
                  ))}
              </div>
            </dl>

            <div className="mt-16 border-t border-[#2C1E16]/30 pt-10 text-center">
              <ButtonLink as={(buttonProps) => <Link to="/products" {...buttonProps} />} className="group relative !h-12 w-full md:w-auto !px-12 !text-base font-display italic tracking-wide !bg-[#2C1E16] text-[#F5F2EB] !border !border-[#2C1E16] !rounded-none hover:!bg-[#F5F2EB] hover:!text-[#2C1E16] cursor-pointer transition-all duration-500 overflow-hidden inline-flex">
                <div className="absolute inset-0 border border-[#B0894A] m-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                Lanjut Berbelanja<span aria-hidden="true" className="ml-2"> &rarr;</span>
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
