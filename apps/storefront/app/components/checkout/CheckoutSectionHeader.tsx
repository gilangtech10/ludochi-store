import { Button } from '@app/components/common/buttons/Button';
import { CheckoutStep } from '@app/providers/checkout-provider';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import { FC, PropsWithChildren } from 'react';

export const CheckoutSectionHeader: FC<
  PropsWithChildren<{
    completed: boolean;
    setStep: (step: CheckoutStep) => void;
    step: CheckoutStep;
  }>
> = ({ completed, setStep, step, children }) => {
  return (
    <header className="relative flex items-baseline justify-between mb-4">
      <h2 className="text-3xl font-display italic text-[#2C1E16] tracking-tight">{children}</h2>
      {completed && (
        <>
          <Button className="text-xs uppercase tracking-widest !text-[#2C1E16]/50 hover:!text-[#B0894A] transition-colors" variant="link" onClick={() => setStep(step)}>
            Ubah
          </Button>
          <span className="absolute -left-10 mt-1.5 hidden h-6 w-6 items-center justify-center rounded-none bg-[#B0894A]/10 text-[#B0894A] border border-[#B0894A]/30 md:flex">
            <CheckIcon className="h-4 w-4" />
          </span>
        </>
      )}
    </header>
  );
};
