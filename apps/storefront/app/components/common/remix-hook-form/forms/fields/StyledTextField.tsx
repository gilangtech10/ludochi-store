import { TextField } from '@lambdacurry/forms/remix-hook-form';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

type StyledTextFieldProps = ComponentProps<typeof TextField> & {
  name: string;
};

export const StyledTextField = ({ className, name, ...props }: StyledTextFieldProps) => {
  return (
    <TextField
      {...props}
      className={clsx(
        '[&_input]:!h-12 [&_input]:border-[#2C1E16]/30 [&_input]:bg-transparent [&_input]:rounded-none [&_input]:text-[#2C1E16] [&_input]:font-display [&_input]:italic [&_input]:shadow-none [&_input]:!ring-0 [&_input]:focus:border-[#B0894A]',
        '[&_input:-webkit-autofill]:!transition-[background-color_5000s_ease-in-out_0s]',
        '[&_input:-webkit-autofill]:!shadow-[0_0_0_1000px_#F5F2EB_inset]',
        '[&_label]:text-xs [&_label]:font-body [&_label]:italic [&_label]:text-[#B0894A]',
        className,
      )}
      name={name}
    />
  );
};
