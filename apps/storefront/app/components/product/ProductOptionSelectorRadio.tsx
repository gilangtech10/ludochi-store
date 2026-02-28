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
                  checked
                    ? 'border-[#C9A962] ring-1 ring-[#C9A962]/50'
                    : 'border-[#4A3F35] hover:border-[#C9A962]/50',
                  'relative col-span-1 flex h-full cursor-pointer flex-col justify-between border px-4 py-3 shadow-none transition-colors duration-200 focus:outline-none',
                  disabled ? 'opacity-40 cursor-not-allowed' : '',
                )
              }
              style={{ backgroundColor: '#251E19' }}
            >
              {({ checked }) => (
                <Label as="div" className="flex items-center w-full cursor-pointer">
                  {/* Option value on the left */}
                  <div className="flex-grow">
                    <span
                      className="text-base"
                      style={{ fontFamily: 'var(--font-display)', color: checked ? '#C9A962' : '#E8DFD4' }}
                    >
                      {optionValue.value}
                    </span>
                    {optionValue.disabled && (
                      <span className="text-xs italic ml-2" style={{ color: '#9C8B7A' }}>(sold out)</span>
                    )}
                  </div>

                  {/* Price + check icon on the right */}
                  <div className="flex items-center">
                    {priceDisplay && (
                      <div className="text-right">
                        <span className="text-sm italic" style={{ fontFamily: 'var(--font-body)', color: '#9C8B7A' }}>
                          {priceDisplay}
                        </span>
                        {discountDisplay && (
                          <span
                            className="ml-1 text-xs"
                            style={{ fontFamily: 'var(--font-label)', color: '#C9A962' }}
                          >
                            ({discountDisplay})
                          </span>
                        )}
                      </div>
                    )}
                    {checked && (
                      <CheckCircleIcon className="h-5 w-5 ml-3" style={{ color: '#C9A962' }} aria-hidden="true" />
                    )}
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
