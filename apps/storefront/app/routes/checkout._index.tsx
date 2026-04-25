import { CheckoutFlow } from '@app/components/checkout/CheckoutFlow';
import { CheckoutSidebar } from '@app/components/checkout/CheckoutSidebar';
import { CheckoutProvider } from '@app/providers/checkout-provider';
import ShoppingCartIcon from '@heroicons/react/24/outline/ShoppingCartIcon';
import { sdk } from '@libs/util/server/client.server';
import { getCartId, removeCartId } from '@libs/util/server/cookies.server';
import { initiatePaymentSession, retrieveCart, setShippingMethod } from '@libs/util/server/data/cart.server';
import { getCustomer } from '@libs/util/server/data/customer.server';
import { listCartPaymentProviders } from '@libs/util/server/data/payment.server';
import { CartDTO, StoreCart, StoreCartShippingOption, StorePaymentProvider } from '@medusajs/types';
import { BasePaymentSession } from '@medusajs/types/dist/http/payment/common';
import { LoaderFunctionArgs, redirect } from 'react-router';
import { Link, useLoaderData } from 'react-router';

const SYSTEM_PROVIDER_ID = 'pp_system_default';

const fetchShippingOptions = async (cartId: string) => {
  if (!cartId) return [];

  try {
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
      cart_id: cartId,
    });
    return shipping_options;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const findCheapestShippingOption = (shippingOptions: StoreCartShippingOption[]) => {
  return shippingOptions.reduce((cheapest, current) => {
    return cheapest.amount <= current.amount ? cheapest : current;
  }, shippingOptions[0]);
};

const ensureSelectedCartShippingMethod = async (request: Request, cart: StoreCart) => {
  const selectedShippingMethod = cart.shipping_methods?.[0];

  if (selectedShippingMethod) return;

  const shippingOptions = await fetchShippingOptions(cart.id);

  const cheapestShippingOption = findCheapestShippingOption(shippingOptions);

  if (cheapestShippingOption) {
    await setShippingMethod(request, { cartId: cart.id, shippingOptionId: cheapestShippingOption.id });
  }
};

const ensureCartPaymentSessions = async (request: Request, cart: StoreCart) => {
  if (!cart) throw new Error('Cart was not provided.');

  let activeSession = cart.payment_collection?.payment_sessions?.find((session) => session.status === 'pending');

  if (!activeSession) {
    const paymentProviders = await listCartPaymentProviders(cart.region_id!);
    if (!paymentProviders.length) return activeSession;

    const provider = paymentProviders.find((p) => p.id !== SYSTEM_PROVIDER_ID) || paymentProviders[0];

    const { payment_collection } = await initiatePaymentSession(request, cart, {
      provider_id: provider.id,
      data: { cart_id: cart.id },
    });

    activeSession = payment_collection.payment_sessions?.find((session) => session.status === 'pending');
  }

  return activeSession as BasePaymentSession;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<{
  cart: StoreCart | null;
  shippingOptions: StoreCartShippingOption[];
  paymentProviders: StorePaymentProvider[];
  activePaymentSession: BasePaymentSession | null;
}> => {
  const customer = await getCustomer(request);
  if (!customer) throw redirect('/account/login?redirectTo=/checkout');

  const cartId = await getCartId(request.headers);

  if (!cartId) {
    return {
      cart: null,
      shippingOptions: [],
      paymentProviders: [],
      activePaymentSession: null,
    };
  }

  const cart = await retrieveCart(request).catch((e) => null);

  if (!cart) {
    throw redirect('/');
  }

  if ((cart as { completed_at?: string }).completed_at) {
    const headers = new Headers();
    await removeCartId(headers);

    throw redirect(`/`, { headers });
  }

  await ensureSelectedCartShippingMethod(request, cart);

  const [shippingOptions, paymentProviders, activePaymentSession] = await Promise.all([
    await fetchShippingOptions(cartId),
    (await listCartPaymentProviders(cart.region_id!)) as StorePaymentProvider[],
    await ensureCartPaymentSessions(request, cart),
  ]);

  const updatedCart = await retrieveCart(request);

  return {
    cart: updatedCart,
    shippingOptions,
    paymentProviders: paymentProviders,
    activePaymentSession: activePaymentSession as BasePaymentSession,
  };
};

export default function CheckoutIndexRoute() {
  const { shippingOptions, paymentProviders, activePaymentSession, cart } = useLoaderData<typeof loader>();

  if (!cart || !cart.items?.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16" style={{ backgroundColor: '#FFFAF4' }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: '#FFF3E4' }}
        >
          <ShoppingCartIcon className="w-7 h-7" style={{ color: '#C4A882' }} />
        </div>
        <p
          className="text-lg mb-1 text-center"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: '#3D2B1F' }}
        >
          Keranjang masih kosong
        </p>
        <p className="text-sm mb-6 text-center" style={{ color: '#9C8070', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          Tambahkan produk terlebih dahulu
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
          style={{ backgroundColor: '#3D2B1F', color: '#FFFAF4', fontFamily: 'var(--font-label)' }}
        >
          Lihat Menu
        </Link>
      </div>
    );

  return (
    <CheckoutProvider
      data={{
        cart: cart as StoreCart | null,
        activePaymentSession: activePaymentSession,
        shippingOptions: shippingOptions,
        paymentProviders: paymentProviders,
      }}
    >
      <section
        className="min-h-screen relative selection:bg-[#E8D5B0] selection:text-[#3D2B1F]"
        style={{ backgroundColor: '#FFFAF4', color: '#3D2B1F' }}
      >
        <div className="mx-auto max-w-2xl px-4 pb-10 pt-4 sm:px-6 sm:pb-16 sm:pt-8 lg:max-w-7xl lg:px-8 lg:pb-24 lg:pt-12 relative">

          {/* ── Checkout header ── */}
          <div
            className="relative overflow-hidden rounded-2xl px-5 pt-6 pb-5 mb-7"
            style={{ background: 'linear-gradient(150deg, #3D2B1F 0%, #6B3A1F 100%)' }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
              style={{ backgroundColor: '#E8D5B0' }}
            />
            <p
              className="text-[9px] tracking-[0.3em] uppercase mb-1"
              style={{ color: 'rgba(232,213,176,0.55)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              チェックアウト
            </p>
            <h1
              className="text-xl sm:text-2xl"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#FFFAF4' }}
            >
              Selesaikan Pesanan
            </h1>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'rgba(255,250,244,0.5)', fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              Isi data pengiriman &amp; pembayaran
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-[4fr_3fr] lg:gap-x-10 xl:gap-x-14">
            <CheckoutFlow />
            <CheckoutSidebar />
          </div>
        </div>
      </section>
    </CheckoutProvider>
  );
}
