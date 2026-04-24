import { StoreCart, StoreCartLineItem, StoreProduct, StoreProductVariant } from '@medusajs/types';
import isNumber from 'lodash/isNumber';
import merge from 'lodash/merge';

export interface FormatPriceOptions {
  currency: Intl.NumberFormatOptions['currency'];
  quantity?: number;
}

export function formatPrice(amount: number | null, options: FormatPriceOptions) {
  const defaultOptions = { currency: 'idr', quantity: 1 };
  const { currency, quantity } = merge({}, defaultOptions, options);

  const isIDR = currency.toUpperCase() === 'IDR';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: isIDR ? 0 : 2,
    maximumFractionDigits: isIDR ? 0 : 2,
  }).format((amount || 0) * quantity);
}

export function sortProductVariantsByPrice(product: StoreProduct) {
  if (!product.variants) return [];
  return product.variants.sort((a, b) => getVariantFinalPrice(a) - getVariantFinalPrice(b));
}

export function getVariantPrices(variant: StoreProductVariant) {
  return {
    calculated: variant.calculated_price?.calculated_amount,
    original: variant.calculated_price?.original_amount,
  };
}

export function getVariantFinalPrice(variant: StoreProductVariant) {
  const { calculated, original } = getVariantPrices(variant);

  return (isNumber(calculated) ? calculated : original) as number;
}

export function getCheapestProductVariant(product: StoreProduct) {
  return sortProductVariantsByPrice(product)[0];
}

export function formatLineItemPrice(lineItem: StoreCartLineItem, regionCurrency: string) {
  return formatPrice(lineItem.unit_price, {
    currency: regionCurrency,
    quantity: lineItem.quantity,
  });
}

export function formatCartSubtotal(cart: StoreCart) {
  return formatPrice(cart.item_subtotal || 0, {
    currency: cart.region?.currency_code,
  });
}
