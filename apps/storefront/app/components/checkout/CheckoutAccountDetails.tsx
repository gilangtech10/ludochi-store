import { useCheckout } from '@app/hooks/useCheckout';
import { useCustomer } from '@app/hooks/useCustomer';
import { CheckoutStep } from '@app/providers/checkout-provider';
import { accountDetailsSchema } from '@app/routes/api.checkout.account-details';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form';
import type { MedusaAddress } from '@libs/types';
import { medusaAddressToAddress } from '@libs/util';
import { checkAccountDetailsComplete } from '@libs/util/checkout';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import { MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { StoreCustomer } from '@medusajs/types';
import { useEffect, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { FormError } from '../common/remix-hook-form/forms/FormError';
import { CheckoutSectionHeader } from './CheckoutSectionHeader';
import HiddenAddressGroup from './HiddenAddressGroup';
import { MedusaStripeAddress, type StripeAddress } from './MedusaStripeAddress/MedusaStripeAddress';
import { AddressDisplay } from './address/AddressDisplay';
import { selectInitialShippingAddress } from './checkout-form-helpers';

const NEW_ADDRESS_ID = 'new';

type SavedAddress = NonNullable<StoreCustomer['addresses']>[0];

export const CheckoutAccountDetails = () => {
  const fetcher = useFetcher<{ errors: FieldErrors }>({ key: FetcherKeys.cart.accountDetails });
  const { customer } = useCustomer();
  const { step, setStep, goToNextStep, cart, isCartMutating } = useCheckout();
  const isActiveStep = step === CheckoutStep.ACCOUNT_DETAILS;

  const savedAddresses = (customer?.addresses ?? []) as SavedAddress[];
  const initialAddress = selectInitialShippingAddress(cart!, customer!);
  const initialAddressId =
    (initialAddress as any)?.id ?? (savedAddresses.length > 0 ? savedAddresses[0].id : NEW_ADDRESS_ID);

  const [selectedId, setSelectedId] = useState<string>(initialAddressId ?? NEW_ADDRESS_ID);

  if (!cart) return null;

  const isComplete = checkAccountDetailsComplete(cart);
  const isSubmitting = ['submitting', 'loading'].includes(fetcher.state);
  const hasErrors = !!fetcher.data?.errors;

  const countryOptions =
    (cart.region?.countries?.map((c) => ({
      value: c.iso_2,
      label: c.display_name,
    })) as { value: string; label: string }[]) ?? [];

  const completedAddress = medusaAddressToAddress(cart.shipping_address as MedusaAddress);

  const addrToForm = (a: SavedAddress) => ({
    firstName: a.first_name ?? '',
    lastName: a.last_name ?? '',
    company: '',
    address1: a.address_1 ?? '',
    address2: '',
    city: a.city ?? '',
    province: a.province ?? '',
    countryCode: a.country_code ?? 'id',
    postalCode: a.postal_code ?? '',
    phone: a.phone ?? '',
  });

  const initialFormAddress = initialAddress
    ? medusaAddressToAddress(initialAddress as MedusaAddress)
    : savedAddresses.length > 0
      ? addrToForm(savedAddresses[0])
      : medusaAddressToAddress(null as any);

  const form = useRemixForm({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      cartId: cart.id,
      email: customer?.email ?? cart.email ?? '',
      customerId: customer?.id,
      shippingAddress: initialFormAddress,
      shippingAddressId: initialAddressId ?? NEW_ADDRESS_ID,
    },
    fetcher,
    submitConfig: { method: 'post', action: '/api/checkout/account-details' },
  });

  const shippingAddress = form.watch('shippingAddress');
  const isNew = selectedId === NEW_ADDRESS_ID;

  const pickAddress = (addr: SavedAddress) => {
    const f = addrToForm(addr);
    setSelectedId(addr.id!);
    form.setValue('shippingAddressId', addr.id!);
    (Object.entries(f) as [string, string][]).forEach(([k, v]) =>
      form.setValue(`shippingAddress.${k}` as any, v),
    );
  };

  const pickNew = () => {
    setSelectedId(NEW_ADDRESS_ID);
    form.setValue('shippingAddressId', NEW_ADDRESS_ID);
    const empty = {
      firstName: '', lastName: '', company: '', address1: '', address2: '',
      city: '', province: '', countryCode: 'id', postalCode: '', phone: '',
    };
    (Object.entries(empty) as [string, string][]).forEach(([k, v]) =>
      form.setValue(`shippingAddress.${k}` as any, v),
    );
  };

  const setAddr = (a: StripeAddress) => {
    (Object.entries(a.address) as [string, string][]).forEach(([k, v]) =>
      form.setValue(`shippingAddress.${k}` as any, v ?? ''),
    );
  };

  useEffect(() => {
    if (isActiveStep && !isSubmitting && !hasErrors && isComplete) {
      form.reset();
      goToNextStep();
    }
  }, [isSubmitting, isComplete]);

  return (
    <div className="checkout-account-details">
      <CheckoutSectionHeader
        completed={isComplete && !isActiveStep}
        setStep={setStep}
        step={CheckoutStep.ACCOUNT_DETAILS}
      >
        Alamat Pengiriman
      </CheckoutSectionHeader>

      {/* Completed summary */}
      {isComplete && !isActiveStep && (
        <div
          className="rounded-xl px-4 py-3 mb-2"
          style={{ backgroundColor: '#FFF3E4', border: '1px solid #E2CCB0' }}
        >
          <AddressDisplay address={completedAddress} countryOptions={countryOptions} />
        </div>
      )}

      {isActiveStep && (
        <RemixFormProvider {...form}>
          <fetcher.Form id="checkout-account-details-form" onSubmit={form.handleSubmit}>
            {/* Hidden base fields */}
            <TextField type="hidden" name="cartId" />
            <TextField type="hidden" name="customerId" />
            <TextField type="hidden" name="email" />
            <TextField type="hidden" name="shippingAddressId" />

            {/* ── Saved address cards ── */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2 mb-4">
                {savedAddresses.map((addr) => {
                  const sel = selectedId === addr.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => pickAddress(addr)}
                      className="w-full text-left rounded-xl px-4 py-3 transition-all"
                      style={{
                        backgroundColor: sel ? '#FFF3E4' : '#FFFFFF',
                        border: sel ? '2px solid #C47C3A' : '1.5px solid #F0E6D6',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <MapPinIcon
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: sel ? '#C47C3A' : '#9C8070' }}
                          />
                          <div className="min-w-0">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: '#3D2B1F', fontFamily: 'var(--font-body)' }}
                            >
                              {[addr.first_name, addr.last_name].filter(Boolean).join(' ') || '—'}
                            </p>
                            <p
                              className="text-xs mt-0.5 leading-snug"
                              style={{ color: '#7A5C4E', fontFamily: 'var(--font-body)' }}
                            >
                              {[addr.address_1, addr.city, addr.province, addr.postal_code]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                            {addr.phone && (
                              <p className="text-xs mt-0.5" style={{ color: '#9C8070' }}>
                                {addr.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        {sel && (
                          <CheckCircleIcon
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: '#C47C3A' }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* New address option */}
                <button
                  type="button"
                  onClick={pickNew}
                  className="w-full text-left rounded-xl px-4 py-3 transition-all flex items-center gap-3"
                  style={{
                    backgroundColor: isNew ? '#FFF3E4' : '#FFFFFF',
                    border: isNew ? '2px solid #C47C3A' : '1.5px dashed #E2CCB0',
                  }}
                >
                  <PlusIcon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: isNew ? '#C47C3A' : '#9C8070' }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isNew ? '#C47C3A' : '#9C8070',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Tambah Alamat Baru
                  </span>
                </button>
              </div>
            )}

            {/* Address form — shown for new address or when no saved addresses */}
            {(isNew || savedAddresses.length === 0) && (
              <MedusaStripeAddress mode="shipping" address={shippingAddress} setAddress={setAddr} />
            )}

            <HiddenAddressGroup address={shippingAddress} prefix="shippingAddress" />
            <FormError />

            <div className="mt-5 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting || isCartMutating}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                style={{
                  backgroundColor: '#3D2B1F',
                  color: '#FFFAF4',
                  fontFamily: 'var(--font-label)',
                  letterSpacing: '0.06em',
                }}
              >
                {isSubmitting ? 'Menyimpan…' : 'Simpan & Lanjut →'}
              </button>

              {isComplete && (
                <button
                  type="button"
                  onClick={() => goToNextStep()}
                  className="w-full py-2.5 rounded-xl text-sm transition-all"
                  style={{
                    color: '#9C8070',
                    fontFamily: 'var(--font-body)',
                    border: '1.5px solid #F0E6D6',
                    backgroundColor: 'transparent',
                  }}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </fetcher.Form>
        </RemixFormProvider>
      )}
    </div>
  );
};
