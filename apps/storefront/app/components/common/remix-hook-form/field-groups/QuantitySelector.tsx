import { StoreProductVariant } from '@medusajs/types';
import clsx from 'clsx';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useRemixFormContext } from 'remix-hook-form';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface QuantitySelectorProps {
  variant: StoreProductVariant | undefined;
  maxInventory?: number;
  className?: string;
  onChange?: (quantity: number) => void;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({
  className,
  variant,
  maxInventory = 10,
  onChange,
}) => {
  const formContext = useRemixFormContext();

  if (!formContext) return null;

  const { control } = formContext;

  const maxQty =
    variant?.manage_inventory && !variant.allow_backorder
      ? Math.min(variant.inventory_quantity || 0, maxInventory)
      : maxInventory;

  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field }) => {
        const qty = Number(field.value) || 1;

        const decrement = () => {
          if (qty <= 1) return;
          field.onChange(qty - 1);
          onChange?.(qty - 1);
        };

        const increment = () => {
          if (qty >= maxQty) return;
          field.onChange(qty + 1);
          onChange?.(qty + 1);
        };

        return (
          <div
            className={clsx('flex items-center rounded-2xl overflow-hidden', className)}
            style={{ border: '1.5px solid #E2CCB0', backgroundColor: '#FFFAF4' }}
          >
            <button
              type="button"
              onClick={decrement}
              disabled={qty <= 1}
              className="w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-30 active:bg-[#F0E6D6]"
              style={{ color: '#6B3A1F' }}
              aria-label="Kurangi jumlah"
            >
              <MinusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>

            <span
              className="w-7 text-center text-sm select-none"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#3D2B1F' }}
            >
              {qty}
            </span>

            <button
              type="button"
              onClick={increment}
              disabled={qty >= maxQty}
              className="w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-30 active:bg-[#F0E6D6]"
              style={{ color: '#6B3A1F' }}
              aria-label="Tambah jumlah"
            >
              <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        );
      }}
    />
  );
};
