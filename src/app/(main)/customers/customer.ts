export interface Customer {
  id: number;
  name: string;
  account_number: string;
  account_type: string;
  ifsc: string;
  mobile: string;
  opening_balance: string;
  photo_url: string;
  created_at: string;
  bank_name: string;
  bank_code: string;
  branch_name: string | null;
}

export interface MappedCustomer {
  account_number: any;
  id: number;
  name: string;
  mobile: string;
  accountShort: string;
  bank: string;
  type: "Savings" | "Current" | "Jan Dhan";
  lastPrint: string;
  fetchedAt: string; // ISO date saved during fetch
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
  errors?: any[];
}

export interface CreateCustomerPayload {
  name: string;
  account_number: string;
  account_type: string;
  ifsc: string;
  bank_id: number;
  branch_id: number;
  mobile: string;
  opening_balance: number;
}

export interface FetchCustomersParams {
  page?: number;
  search?: string;
  limit?: number;
  bank_id?: number;
  account_type?: "savings" | "current" | "jan_dhan";
}