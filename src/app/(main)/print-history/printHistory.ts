import { ReactNode } from "react";

// ── Raw API shape ──────────────────────────────────────────
export interface PrintJob {
  account_number: ReactNode;
  id: number;
  customer_id: number;
  customer_name: string;
  bank_id: number;
  bank_name: string;
  bank_code: string;
  job_type: string;         // "passbook" | "form" | "combo" | "acct_form" | "jan_dhan"
  pages: number;
  charge: string;           // API returns string e.g. "12.00"
  status: string;           // "printed" | "failed" | "pending"
  is_free: boolean;
  created_at: string;       // ISO date
}

// ── Display shape ──────────────────────────────────────────
export type JobTypeLabel = "Passbook" | "Form" | "Combo" | "Acct Form" | "Jan Dhan";
export type StatusLabel  = "Printed" | "Failed" | "Pending";

export interface MappedPrintJob {
  createdAtRaw: string;
  id: string;
  dateTime: string;
  customer: string;
  bank: string;
  type: JobTypeLabel;
  pages: string;
  charge: string;
  status: StatusLabel;
  isFree: boolean;
  rawCharge: number;
}

// ── API meta + response ────────────────────────────────────
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
}

// ── Fetch params (matches backend query params) ────────────
export interface FetchPrintHistoryParams {
  customer_id?: number;
  bank_id?: number;
  from_date?: string;   // YYYY-MM-DD
  to_date?: string;     // YYYY-MM-DD
  page?: number;
  limit?: number;
}

// ── Stats derived from list ────────────────────────────────
export interface PrintStats {
  totalJobs: number;
  totalPages: number;
  totalCharge: number;
  freeJobs: number;
}