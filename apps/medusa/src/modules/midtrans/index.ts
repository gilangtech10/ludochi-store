import { ModuleProvider, Modules } from '@medusajs/utils';
import MidtransPaymentProviderService from './service';

export default ModuleProvider(Modules.PAYMENT, {
  services: [MidtransPaymentProviderService],
});
