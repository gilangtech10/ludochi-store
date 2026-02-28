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
        '[&_input]:!h-12 [&_input]:border-[#4A3F35] [&_input]:bg-[#1C1714] [&_input]:rounded-none [&_input]:text-[#E8DFD4] [&_input]:shadow-none [&_input]:!ring-0 [&_input]:focus:border-[#C9A962] [&_input]:placeholder:text-[#9C8B7A]',
        '[&_input:-webkit-autofill]:!transition-[background-color_5000s_ease-in-out_0s]',
        '[&_input:-webkit-autofill]:!shadow-[0_0_0_1000px_#1C1714_inset] [&_input:-webkit-autofill]:![-webkit-text-fill-color:#E8DFD4]',
        '[&_label]:text-[0.6rem] [&_label]:font-label [&_label]:not-italic [&_label]:tracking-[0.2em] [&_label]:uppercase [&_label]:text-[#C9A962]',
        className,
      )}
      name={name}
    />
  );
};
