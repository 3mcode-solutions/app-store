export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCity: string;
  storeCountry: string;
  storeZipCode?: string;
  storeCurrency: string;
  storeLanguage: string;
  storeDescription?: string;
  storeKeywords?: string;
  storeLogo?: string;
  storeFacebook?: string;
  storeTwitter?: string;
  storeInstagram?: string;
  storeLinkedIn?: string;
  storeYouTube?: string;
}

export interface ShippingSettings {
  enableShipping: boolean;
  shippingMethods: ShippingMethod[];
  freeShippingThreshold: number;
}

export interface ShippingMethod {
  id: number;
  name: string;
  cost: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface PaymentSettings {
  enableCashOnDelivery: boolean;
  enableCreditCard: boolean;
  enablePayPal: boolean;
  enableBankTransfer: boolean;
  paymentInstructions?: string;
  creditCardGateway?: string;
  paypalClientId?: string;
  bankAccountDetails?: string;
}
