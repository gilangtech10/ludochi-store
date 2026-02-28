import { useCheckout } from '@app/hooks/useCheckout';
import { useEnv } from '@app/hooks/useEnv';
import { useRegion } from '@app/hooks/useRegion';
import { Address } from '@libs/types';
import { BaseCartAddress } from '@medusajs/types/dist/http/cart/common';
import { AddressElement, Elements } from '@stripe/react-stripe-js';
import { type AddressMode, StripeAddressElementChangeEvent, loadStripe } from '@stripe/stripe-js';
import { type Dispatch, type FC, type SetStateAction, useMemo } from 'react';

export interface StripeAddress {
  address: Address;
  completed: boolean;
}

export const defaultStripeAddress = (address?: BaseCartAddress | null | undefined): StripeAddress => ({
  address: {
    firstName: address?.first_name || '',
    lastName: address?.last_name || '',
    address1: address?.address_1 || '',
    address2: address?.address_2 || '',
    province: address?.province || '',
    city: address?.city || '',
    countryCode: address?.country_code || 'us',
    postalCode: address?.postal_code || '',
    phone: address?.phone || '',
  },
  completed: false,
});

interface MedusaStripeAddressProps {
  title?: string;
  address: Address;
  mode: AddressMode;
  allowedCountries?: string[];
  setAddress: (address: StripeAddress) => void;
}

export const MedusaStripeAddress: FC<MedusaStripeAddressProps> = ({
  title,
  address,
  mode,
  allowedCountries = [],
  setAddress,
}) => {
  const { env } = useEnv();
  const { cart } = useCheckout();
  const { region } = useRegion();

  const handleChange = (
    event:
      | StripeAddressElementChangeEvent
      | Pick<StripeAddressElementChangeEvent, 'complete' | 'isNewAddress' | 'value'>,
  ) => {
    const fullNameArray = event.value.name?.split(' ') || [];
    const firstName = fullNameArray.slice(0, -1).join(' ');
    const lastName = fullNameArray.slice(-1).join(' ');

    // Stripe does not return province for some countries
    const useProvincePlaceHolder = event.complete && !event.value.address.state;

    setAddress({
      address: {
        firstName: event.value.firstName || firstName || '',
        lastName: event.value.lastName || lastName || '',
        address1: event.value.address.line1,
        address2: event.value.address.line2 ?? '',
        province: useProvincePlaceHolder ? '-' : event.value.address.state,
        city: event.value.address.city,
        countryCode: event.value.address.country?.toLowerCase() as string,
        postalCode: event.value.address.postal_code,
        phone: event.value.phone ?? '',
      },
      completed: event.complete,
    });
  };

  const stripePromise = useMemo(() => {
    return env.STRIPE_PUBLIC_KEY ? loadStripe(env.STRIPE_PUBLIC_KEY) : null;
  }, [env.STRIPE_PUBLIC_KEY]);

  if (!cart) return null;

  return (
    <div>
      {title && <h3 className="mt-6 text-sm">{title}</h3>}
      <Elements
        stripe={stripePromise}
        options={{
          mode: 'setup',
          currency: region.currency_code,
          appearance: {
            variables: {
              borderRadius: '0px',
              spacingUnit: '4.601px',
              fontSizeBase: '14px',
              colorText: '#E8DFD4',
              colorBackground: '#261D19',
              colorPrimary: '#C9A962',
              colorDanger: '#C0392B',
              fontWeightNormal: '400',
              fontWeightBold: '600',
              fontSizeSm: '12px',
            },
            rules: {
              '.Input': {
                fontSize: '0.95rem',
                color: '#E8DFD4',
                backgroundColor: '#261D19',
                border: '1px solid #4A3F35',
                boxShadow: 'none',
                padding: '10px 14px',
              },
              '.Input:focus': {
                border: '1px solid #C9A962',
                boxShadow: 'none',
                outline: 'none',
              },
              '.Input::placeholder': {
                color: '#9C8B7A',
              },
              '.Label': {
                fontWeight: '400',
                color: '#C9A962',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              },
              '.Error': {
                color: '#C0392B',
                fontSize: '0.75rem',
              },
            },
          },
        }}
      >
        <AddressElement
          options={{
            mode,
            allowedCountries,
            display: { name: 'split' },
            fields: { phone: 'always' },
            validation: { phone: { required: 'always' } },
            defaultValues: {
              address: {
                line1: address.address1,
                line2: address.address2,
                city: address.city,
                state: address.province,
                postal_code: address.postalCode,
                country: address.countryCode?.toUpperCase() || 'us',
              },
              phone: address.phone,
              firstName: address.firstName,
              lastName: address.lastName,
            },
          }}
          onChange={handleChange}
        />
      </Elements>
    </div>
  );
};
