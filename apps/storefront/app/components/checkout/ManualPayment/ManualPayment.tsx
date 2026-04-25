import { CustomPaymentSession } from '@libs/types';
import { FC, PropsWithChildren } from 'react';
import { CompleteCheckoutForm } from '../CompleteCheckoutForm';

export interface ManualPaymentProps extends PropsWithChildren {
  isActiveStep: boolean;
  paymentMethods: CustomPaymentSession[];
}

export const ManualPayment: FC<ManualPaymentProps> = (props) => (
  <CompleteCheckoutForm
    providerId="pp_system_default"
    id="ManualPaymentForm"
    submitMessage="Konfirmasi Pesanan (Test)"
    className="mt-4"
    {...props}
  />
);
