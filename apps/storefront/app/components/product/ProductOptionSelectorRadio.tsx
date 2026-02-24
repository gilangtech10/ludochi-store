import { Label, Radio, RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '@libs/util/prices';
import clsx from 'clsx';
import type { FC } from 'react';

export interface ProductOptionSelectorProps {
  option: {
    title: string;
    id: string;
    values: {
      value: string;
      minPrice?: number;
      maxPrice?: number;
      exactPrice?: number;
      discountPercentage?: number;
      disabled?: boolean;
    }[];
  };
  onChange?: (name: string, value: string) => void;
  value?: string;
  currencyCode: string;
}

export const ProductOptionSelectorRadio: FC<ProductOptionSelectorProps> = ({
  option,
  onChange,
  value,
  currencyCode,
}) => {
  const handleChange = (name: string, value: string) => {
    if (onChange) onChange(name, value);
  };

  // Filter unique values
  const uniqueValues = option.values.filter(
    (optionValue, index, self) => self.findIndex((item) => item.value === optionValue.value) === index,
  );

  // Sort values by price (low to high)
  const sortedValues = [...uniqueValues].sort((a, b) => {
    const aPrice = a.minPrice || a.exactPrice || 0;
    const bPrice = b.minPrice || b.exactPrice || 0;
    return aPrice - bPrice;
  });

  return (
    <RadioGroup
      name={`options.${option.id}`}
      value={value}
      onChange={(changedValue) => handleChange(option.id, changedValue)}
    >
      <div className="grid grid-cols-1 gap-2">
        {sortedValues.map((optionValue, valueIndex) => {
          // Format the price display
          let priceDisplay = '';
          let discountDisplay = '';

          if (optionValue.minPrice !== undefined && optionValue.maxPrice !== undefined) {
            if (optionValue.minPrice === optionValue.maxPrice) {
              // Single price
              priceDisplay = formatPrice(optionValue.minPrice, { currency: currencyCode });
            } else {
              // Price range
              priceDisplay = `${formatPrice(optionValue.minPrice, { currency: currencyCode })} – ${formatPrice(optionValue.maxPrice, { currency: currencyCode })}`;
            }
          } else if (optionValue.exactPrice !== undefined) {
            // Exact price
            priceDisplay = formatPrice(optionValue.exactPrice, { currency: currencyCode });

            // Format discount if available
            if (optionValue.discountPercentage) {
              discountDisplay = `${optionValue.discountPercentage}% off`;
            }
          }

          return (
            <Radio
              key={valueIndex}
              value={optionValue.value}
              disabled={optionValue.disabled}
              className={({ checked, disabled }) =>
                clsx(
                  'group',
                  checked ? 'border-[#B0894A] bg-[#B0894A]/5 ring-1 ring-[#B0894A]' : 'bg-transparent border-[#2C1E16]/30',
                  'relative col-span-1 flex h-full cursor-pointer flex-col justify-between rounded-none border px-4 py-3 shadow-none hover:border-[#B0894A] transition-colors focus:outline-none',
                  disabled ? 'opacity-50 cursor-not-allowed' : '',
                )
              }
            >
              {({ checked }) => (
                <Label as="div" className="flex items-center w-full cursor-pointer">
                  {/* Option value on the left */}
                  <div className="flex-grow">
                    <span className={clsx('text-base font-display font-medium', checked ? 'text-[#B0894A]' : 'text-[#2C1E16]')}>
                      {optionValue.value}
                    </span>
                    {optionValue.disabled && <span className="text-xs text-[#2C1E16]/50 italic ml-2">(habis)</span>}
                  </div>

                  {/* Price information and check icon on the right */}
                  <div className="flex items-center">
                    {priceDisplay && (
                      <div className="text-right">
                        <span className="text-sm font-body italic text-[#2C1E16]/70">{priceDisplay}</span>
                        {discountDisplay && (
                          <span className="ml-1 text-xs font-display font-medium text-[#B0894A]">({discountDisplay})</span>
                        )}
                      </div>
                    )}
                    {checked && <CheckCircleIcon className="text-[#B0894A] h-5 w-5 ml-3" aria-hidden="true" />}
                  </div>
                </Label>
              )}
            </Radio>
          );
        })}
      </div>
    </RadioGroup>
  );
};
