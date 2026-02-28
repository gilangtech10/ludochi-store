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
      <h2
        className="text-3xl tracking-tight"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8DFD4', fontStyle: 'italic' }}
      >
        {children}
      </h2>
      {completed && (
        <>
          <Button
            className="transition-colors"
            style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B7A' }}
            variant="link"
            onClick={() => setStep(step)}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C9A962')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#9C8B7A')}
          >
            Edit
          </Button>
          <span className="absolute -left-10 mt-1.5 hidden h-6 w-6 items-center justify-center md:flex" style={{ backgroundColor: 'rgba(201,169,98,0.1)', border: '1px solid rgba(201,169,98,0.4)' }}>
            <CheckIcon className="h-4 w-4" style={{ color: '#C9A962' }} />
          </span>
        </>
      )}
    </header>
  );
};
