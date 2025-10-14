export interface AddressDto {
  id?: number;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string; // 2-letter
  phone?: string;
  label?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

