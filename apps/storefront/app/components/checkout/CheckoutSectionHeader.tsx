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
      <h2
        className="text-xl font-semibold"
        style={{ fontFamily: 'var(--font-display)', color: '#3D2B1F' }}
      >
        {children}
      </h2>
      {completed && (
        <>
          <button
            type="button"
            onClick={() => setStep(step)}
            className="text-xs font-semibold tracking-widest uppercase transition-colors"
            style={{ color: '#C47C3A', fontFamily: 'var(--font-label)', letterSpacing: '0.15em' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#3D2B1F')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#C47C3A')}
          >
            Ubah
          </button>
          <span
            className="absolute -left-8 hidden h-5 w-5 items-center justify-center rounded-full md:flex"
            style={{ backgroundColor: '#FFF3E4', border: '1.5px solid #C47C3A' }}
          >
            <CheckIcon className="h-3 w-3" style={{ color: '#C47C3A' }} />
          </span>
        </>
      )}
    </header>
  );
};
