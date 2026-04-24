import { Label, Radio, RadioGroup } from '@headlessui/react';
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
  const uniqueValues = option.values.filter(
    (v, i, arr) => arr.findIndex((x) => x.value === v.value) === i,
  );

  const sortedValues = [...uniqueValues].sort((a, b) => {
    const aP = a.minPrice ?? a.exactPrice ?? 0;
    const bP = b.minPrice ?? b.exactPrice ?? 0;
    return aP - bP;
  });

  return (
    <RadioGroup
      name={`options.${option.id}`}
      value={value}
      onChange={(val) => onChange?.(option.id, val)}
    >
      <div className="flex flex-wrap gap-2">
        {sortedValues.map((optVal, i) => {
          let sub = '';
          if (optVal.minPrice !== undefined && optVal.maxPrice !== undefined) {
            sub = optVal.minPrice === optVal.maxPrice
              ? formatPrice(optVal.minPrice, { currency: currencyCode })
              : `${formatPrice(optVal.minPrice, { currency: currencyCode })}+`;
          } else if (optVal.exactPrice !== undefined) {
            sub = formatPrice(optVal.exactPrice, { currency: currencyCode });
          }

          return (
            <Radio
              key={i}
              value={optVal.value}
              disabled={optVal.disabled}
            >
              {({ checked, disabled }) => (
                <button
                  type="button"
                  disabled={disabled}
                  className={clsx(
                    'flex flex-col items-start px-4 py-2.5 rounded-2xl transition-all duration-200 active:scale-95 text-left',
                    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                  )}
                  style={{
                    backgroundColor: checked ? '#3D2B1F' : '#FFFAF4',
                    border: checked ? '1.5px solid #3D2B1F' : '1.5px solid #E2CCB0',
                    boxShadow: checked ? '0 2px 10px rgba(61,43,31,0.2)' : 'none',
                  }}
                >
                  <span
                    className="text-sm font-semibold leading-tight"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      color: checked ? '#FFFAF4' : '#3D2B1F',
                    }}
                  >
                    {optVal.value}
                    {optVal.disabled && (
                      <span className="ml-1.5 text-[10px] font-normal" style={{ color: checked ? 'rgba(255,250,244,0.5)' : '#C4A882' }}>
                        habis
                      </span>
                    )}
                  </span>
                  {sub && (
                    <span
                      className="text-[11px] mt-0.5"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 300,
                        color: checked ? 'rgba(255,250,244,0.65)' : '#C47C3A',
                      }}
                    >
                      {sub}
                      {optVal.discountPercentage ? ` · ${optVal.discountPercentage}% off` : ''}
                    </span>
                  )}
                </button>
              )}
            </Radio>
          );
        })}
      </div>
    </RadioGroup>
  );
};
