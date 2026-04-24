import { formatPrice } from '@libs/util/prices';
import type { ChangeEvent, FC } from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface ProductOptionSelectorProps {
  option: {
    id: string;
    title: string;
    product_id: string;
    values: {
      value: string;
      minPrice?: number;
      maxPrice?: number;
      exactPrice?: number;
      discountPercentage?: number;
    }[];
  };
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  currencyCode: string;
}

export const ProductOptionSelectorSelect: FC<ProductOptionSelectorProps> = ({
  option,
  onChange,
  value,
  currencyCode,
}) => {
  const { register } = useRemixFormContext();

  const filtered = option.values.filter(
    (v, i, arr) => arr.findIndex((x) => x.value === v.value) === i,
  );

  const sorted = [...filtered].sort((a, b) => {
    return (a.minPrice ?? a.exactPrice ?? 0) - (b.minPrice ?? b.exactPrice ?? 0);
  });

  const formatted = sorted.map((v) => {
    let label = v.value;
    if (v.minPrice !== undefined && v.maxPrice !== undefined) {
      const p = v.minPrice === v.maxPrice
        ? formatPrice(v.minPrice, { currency: currencyCode })
        : `${formatPrice(v.minPrice, { currency: currencyCode })}+`;
      label += ` · ${p}`;
    } else if (v.exactPrice !== undefined) {
      label += ` · ${formatPrice(v.exactPrice, { currency: currencyCode })}`;
      if (v.discountPercentage) label += ` (${v.discountPercentage}% off)`;
    }
    return { value: v.value, label };
  });

  return (
    <div className="flex flex-col gap-2">
      <p
        className="text-[10px] tracking-[0.2em] uppercase"
        style={{ color: '#C47C3A', fontFamily: 'var(--font-label)' }}
      >
        {option.title}
      </p>
      <div className="relative">
        <select
          {...register(`options.${option.id}`)}
          id={option.id}
          defaultValue={value}
          className="w-full appearance-none rounded-2xl px-4 py-3 text-sm pr-10 transition-all duration-200 cursor-pointer outline-none"
          style={{
            backgroundColor: '#FFFAF4',
            border: '1.5px solid #E2CCB0',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: '#3D2B1F',
          }}
          onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = '#C47C3A'; }}
          onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = '#E2CCB0'; }}
        >
          {formatted.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: '#C47C3A' }}
        />
      </div>
    </div>
  );
};
