export interface User {
  id: string;
  // Optional backend numeric id when authenticated against API
  backendId?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}
