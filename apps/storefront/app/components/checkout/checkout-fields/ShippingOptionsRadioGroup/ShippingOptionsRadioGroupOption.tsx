import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import { RadioGroupItem } from '@lambdacurry/forms/ui';
import { formatPrice } from '@libs/util/prices';
import { StoreCartShippingOption, StoreRegion } from '@medusajs/types';
import clsx from 'clsx';
import { FC } from 'react';

export interface ShippingOptionsRadioGroupOptionProps {
  shippingOption: StoreCartShippingOption;
  region: StoreRegion;
  value?: string | null;
}

export const ShippingOptionsRadioGroupOption: FC<ShippingOptionsRadioGroupOptionProps> = ({
  shippingOption,
  region,
  value,
}) => {
  const isSelected = value === shippingOption.id;

  return (
    <div className="relative col-span-1">
      <label htmlFor={shippingOption.id} className="cursor-pointer">
        <div
          className={clsx(
            'group relative flex h-full flex-col justify-between rounded-none border bg-transparent p-4 shadow-none transition-all duration-300',
            'hover:border-[#B0894A] focus:outline-none',
            isSelected ? 'border-transparent bg-[#B0894A]/5' : 'border-[#2C1E16]/30',
          )}
        >
          <div className="flex justify-between gap-1 items-center">
            <div className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#B0894A]">{shippingOption.name}</div>
            <RadioGroupItem
              id={shippingOption.id}
              value={shippingOption.id}
              className="text-[#B0894A] h-5 w-5 border-0 bg-transparent ring-0 focus:ring-0"
              indicator={<CheckCircleIcon className="text-[#B0894A] h-5 w-5" aria-hidden="true" />}
            />
          </div>
          <div className="mt-4 flex flex-col justify-end">
            <div className="font-display font-medium text-xl text-[#2C1E16]">{formatPrice(shippingOption.amount, { currency: region.currency_code })}</div>
          </div>
          <div
            className={clsx(
              'pointer-events-none absolute -inset-px rounded-none border-2 transition-colors',
              isSelected ? 'border-[#B0894A]' : 'border-transparent',
            )}
            aria-hidden="true"
          />
        </div>
      </label>
    </div>
  );
};
