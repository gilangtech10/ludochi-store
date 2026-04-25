import { zodResolver } from '@hookform/resolvers/zod';
import { addressPayload } from '@libs/util/addresses';
import { removeCartId } from '@libs/util/server/cookies.server';
import { initiatePaymentSession, placeOrder, retrieveCart, updateCart } from '@libs/util/server/data/cart.server';
import type { StoreCart } from '@medusajs/types';
import type { ActionFunctionArgs } from 'react-router';
import { redirect, data as remixData } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const completeCheckoutSchema = z.object({
  cartId: z.string(),
  providerId: z.string(),
  paymentMethodId: z.string(),
  noRedirect: z.boolean().optional(),
});

export type CompleteCheckoutFormData = z.infer<typeof completeCheckoutSchema>;

export async function action(actionArgs: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<CompleteCheckoutFormData>(
    actionArgs.request,
    zodResolver(completeCheckoutSchema),
  );

  if (errors) {
    return remixData({ errors }, { status: 400 });
  }

  let cart = (await retrieveCart(actionArgs.request)) as StoreCart;

  // Selalu gunakan shipping address sebagai billing address
  if (cart.shipping_address) {
    cart = (
      await updateCart(actionArgs.request, {
        billing_address: addressPayload(cart.shipping_address),
      })
    )?.cart ?? cart;
  }

  // Hanya buat sesi baru jika belum ada sesi untuk provider ini
  // (tidak cek status 'pending' karena webhook bisa mengubah status sebelum form di-submit)
  const existingSession = cart.payment_collection?.payment_sessions?.find(
    (ps) => ps.provider_id === data.providerId,
  );

  if (!existingSession) {
    await initiatePaymentSession(actionArgs.request, cart, {
      provider_id: data.providerId,
      data: { cart_id: cart.id },
    });
  }

  const cartResponse = await placeOrder(actionArgs.request);

  if (cartResponse.type === 'cart' || !cartResponse) {
    return remixData(
      { errors: { root: { message: 'Cart could not be completed. Please try again.' } } },
      { status: 400 },
    );
  }

  const headers = new Headers();
  await removeCartId(headers);

  const { order } = cartResponse;

  if (data.noRedirect) {
    return remixData({ order }, { headers });
  }

  throw redirect(`/checkout/success?order_id=${order.id}`, { headers });
}
