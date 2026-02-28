import { CheckoutFlow } from '@app/components/checkout/CheckoutFlow';
import { CheckoutSidebar } from '@app/components/checkout/CheckoutSidebar';
import { Empty } from '@app/components/common/Empty/Empty';
import { Button } from '@app/components/common/buttons/Button';
import { CheckoutProvider } from '@app/providers/checkout-provider';
import ShoppingCartIcon from '@heroicons/react/24/outline/ShoppingCartIcon';
import { sdk } from '@libs/util/server/client.server';
import { getCartId, removeCartId } from '@libs/util/server/cookies.server';
import { initiatePaymentSession, retrieveCart, setShippingMethod } from '@libs/util/server/data/cart.server';
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
      <Empty
        icon={ShoppingCartIcon}
        title="Your cart is empty."
        description="Add items to your cart to proceed"
        action={
          <Button variant="primary" as={(buttonProps) => <Link to="/products" {...buttonProps} />} className="btn-brass engraved">
            Browse the Catalogue
          </Button>
        }
      />
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
        className="min-h-screen relative selection:bg-[#C9A962] selection:text-[#1C1714]"
        style={{ backgroundColor: '#1C1714', color: '#E8DFD4' }}
      >
        {/* Atmospheric overlays */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, opacity: 0.03 }}
        />
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 vignette-overlay" />

        <div className="mx-auto max-w-2xl px-4 pb-8 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:max-w-7xl lg:px-8 lg:pb-24 lg:pt-16 relative z-10">
          {/* Checkout page header */}
          <div className="text-center mb-12 pt-8">
            <div className="academia-label-row mb-4 max-w-[8rem] mx-auto">Finalise your order</div>
            <h1
              className="text-4xl md:text-5xl"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4' }}
            >
              The <em style={{ color: '#C9A962' }}>Checkout</em>
            </h1>
          </div>

          <div className="lg:grid lg:grid-cols-[4fr_3fr] lg:gap-x-12 xl:gap-x-16">
            <CheckoutFlow />
            <CheckoutSidebar />
          </div>
        </div>
      </section>
    </CheckoutProvider>
  );
}
