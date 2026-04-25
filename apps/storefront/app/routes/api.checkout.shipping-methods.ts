import { zodResolver } from '@hookform/resolvers/zod';
import {
  initiatePaymentSession,
  retrieveCart,
  setShippingMethod,
  updateCart,
} from '@libs/util/server/data/cart.server';
import { listCartShippingOptions } from '@libs/util/server/data/fulfillment.server';
import type { StoreCart } from '@medusajs/types';
import type { ActionFunctionArgs } from 'react-router';
import { data as remixData } from 'react-router';
import { getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';

export const shippingMethodsSchema = z.object({
  cartId: z.string(),
  shippingOptionIds: z.array(z.string()),
});

export type ChooseCheckoutShippingMethodsFormData = z.infer<typeof shippingMethodsSchema>;

export async function action(actionArgs: ActionFunctionArgs) {
  const { errors, data } = await getValidatedFormData<ChooseCheckoutShippingMethodsFormData>(
    actionArgs.request,
    zodResolver(shippingMethodsSchema),
  );

  if (errors) {
    return remixData({ errors }, { status: 400 });
  }

  const shippingOptions = await listCartShippingOptions(data.cartId);

  // Validate shipping options
  const validShippingOptionIds = data.shippingOptionIds.filter((id) =>
    shippingOptions.some((option) => option.id === id),
  );

  if (validShippingOptionIds.length === 0) {
    return remixData({ errors: { root: { message: 'No valid shipping options selected' } } }, { status: 400 });
  }

  for (const id of validShippingOptionIds) {
    await setShippingMethod(actionArgs.request, {
      cartId: data.cartId,
      shippingOptionId: id,
    });
  }

  // Force payment sessions to be updated
  const updatedCart = (await updateCart(actionArgs.request, {})).cart;

  try {
    await initiatePaymentSession(actionArgs.request, updatedCart, {
      provider_id: 'pp_midtrans_midtrans',
      data: { cart_id: updatedCart.id },
    });
  } catch (e) {
    console.warn('Could not initiate Midtrans payment session after shipping update:', e);
  }

  const cart = (await retrieveCart(actionArgs.request)) as StoreCart;

  return remixData({ cart });
}
