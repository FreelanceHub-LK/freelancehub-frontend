// Payment components
export { PaymentForm } from './PaymentForm';
export { StripePaymentForm } from './StripePaymentForm';
export { PayPalPaymentForm } from './PayPalPaymentForm';
export { PaymentHistory } from './PaymentHistory';
export { EscrowManagement } from './EscrowManagement';

// Payment types
export interface PaymentFormData {
  amount: number;
  currency: string;
  method: 'stripe' | 'paypal' | 'wallet';
  escrowEnabled: boolean;
  autoRelease: boolean;
  autoReleaseDays?: number;
  milestones?: {
    description: string;
    amount: number;
  }[];
  description: string;
  projectId?: string;
  contractId?: string;
  recipientId: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  redirectUrl?: string;
}
