'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { fetchPrintHistory } from '../../redux/slices/printHistorySlice';
import { fetchCustomers } from '../../redux/slices/customersSlice';
import toast from 'react-hot-toast';
import api from "../../utils/axios";

type PrintJobRow = {
  id?: string;
  customer?: string;
  customer_name?: string;
  account_number?: string;
  bank?: string;
  bank_name?: string;
  bank_code?: string;
  type?: string;
  job_type?: string;
  created_at?: string;
  createdAtRaw?: string;
  charge?: string | number | null;
  rawCharge?: number;
  is_reprint?: boolean;
  status?: string;
};

const typeConfig: Record<string, { bg: string; text: string }> = {
  Passbook: { bg: 'bg-[#eff2f9]', text: 'text-[#0f2744]' },
  'Form + PB': { bg: 'bg-[#fffbeb]', text: 'text-[#d97706]' },
  'Acct Form': { bg: 'bg-[#eff6ff]', text: 'text-[#0284c7]' },
  'Jan Dhan': { bg: 'bg-[#f0fdf4]', text: 'text-[#16a34a]' },
  Form: { bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]' },
  Combo: { bg: 'bg-[#f5f3ff]', text: 'text-[#7c3aed]' },
};

const maskAccountNumber = (accountNumber?: string) => {
  if (!accountNumber) return '—';
  if (accountNumber.length <= 4) return accountNumber;
  const lastFour = accountNumber.slice(-4);
  const maskedPart = 'x'.repeat(accountNumber.length - 4);
  return `${maskedPart}${lastFour}`;
};

const findAccountNumberByCustomerName = (customerName: string, customers: any[]) => {
  if (!customerName) return null;
  
  console.log('Looking for customer:', customerName);
  console.log('Available customers:', customers.map(c => ({ name: c.name, account_number: c.account_number })));
  
  const customer = customers.find(c => 
    c.name === customerName || 
    c.name?.toLowerCase() === customerName?.toLowerCase()
  );
  
  console.log('Found customer:', customer);
  console.log('Account number:', customer?.account_number);
  
  return customer?.account_number;
};

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeJobType = (jobType?: string) => {
  if (!jobType) return 'Passbook';
  const value = jobType.trim().toLowerCase();
  if (value === 'passbook') return 'Passbook';
  if (value === 'form + pb' || value === 'form+pb') return 'Form + PB';
  if (value === 'form') return 'Form';
  if (value === 'combo') return 'Combo';
  if (value === 'acct form' || value === 'acct_form') return 'Acct Form';
  if (value === 'jan dhan' || value === 'jan_dhan') return 'Jan Dhan';
  return jobType;
};

export default function RecentPrintJobs() {
  const dispatch = useAppDispatch();
  const [reprintingJobId, setReprintingJobId] = useState<string | null>(null);
  
  // ✅ Use printHistory slice instead of dashboard
  const printHistoryState = useAppSelector((s: any) => s.printHistory);
  
  // ✅ Get customers data for account number lookup
  const customersState = useAppSelector((s: any) => s.customers);
  
  useEffect(() => {
    dispatch(fetchPrintHistory({ limit: 5 }) as any);
    dispatch(fetchCustomers({ limit: 100 }) as any); // Fetch customers for account number lookup
  }, [dispatch]);

  const loading = Boolean(printHistoryState?.loading);
  const error = printHistoryState?.error;
  
  // ✅ Use mappedList from printHistory slice (top 5 recent)
  const jobs: PrintJobRow[] = printHistoryState?.mappedList?.slice(0, 5) || [];

  const handleReprint = async (jobId: string) => {
    if (reprintingJobId === jobId) return;
    
    try {
      setReprintingJobId(jobId);
      const response = await api.post(`/csp/passbook/reprint/${jobId}`);
      
      if (response.data.success) {
        const { pdf_signed_url, is_free, reprint_charge } = response.data.data;
        
        // Open PDF in new tab
        window.open(pdf_signed_url, '_blank');
        
        toast.success(
          `Reprint ready! ${is_free ? 'Free reprint' : `₹${reprint_charge} charged`}`
        );
      } else {
        toast.error(response.data.message || 'Reprint failed');
      }
    } catch (error: any) {
      console.error('Reprint error:', error);
      const message = error.response?.data?.message || error.message || 'Reprint failed';
      toast.error(message);
    } finally {
      setReprintingJobId(null);
    }
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
        <h2 className="text-[14px] font-bold text-[#111827] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#0d8f72] rounded-full flex-shrink-0" />
          Recent Print Jobs
        </h2>

        <Link
          href="/print-history"
          className="text-[11px] font-bold text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f5f8] transition-all px-[9px] py-1 rounded-[5px]"
        >
          View all →
        </Link>
      </div>

      {loading && (
        <div className="p-8 text-center text-[#6b7280] text-[13px]">
          Loading...
        </div>
      )}

      {!loading && error && (
        <div className="p-8 text-center text-red-600 text-[13px]">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="py-12 text-center">
          <span className="text-[40px] block mb-3 opacity-40">🖨️</span>
          <p className="text-[15px] font-bold text-[#374151] mb-1">
            No print jobs yet
          </p>
          <p className="text-[13px] text-[#6b7280]">
            Your recent prints will appear here
          </p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="overflow-x-auto header_scrollbar-hide">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Customer', 'Type', 'Bank', 'Time', 'Charge', ''].map((h) => (
                  <th
                    key={h}
                    className="bg-[#f3f5f8] px-[14px] py-[10px] text-left text-[11px] font-semibold uppercase tracking-[0.7px] text-[#6b7280] border-b border-[#e5e7eb] whitespace-nowrap first:pl-5 last:pr-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {jobs.map((j) => {
                const normalizedType = normalizeJobType(j?.type || j?.job_type);
                const typeStyle = typeConfig[normalizedType] || typeConfig.Passbook;

                return (
                  <tr
                    key={j?.id ?? `${j?.account_number}-${j?.created_at}`}
                    className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafbfc] transition-colors"
                  >
                    <td className="px-[14px] py-3 pl-5">
                      <p className="font-semibold text-[13px] text-[#374151] leading-tight">
                        {j?.customer_name || j?.customer || 'N/A'}
                      </p>
                      <p className="text-[11px] text-[#6b7280] font-mono mt-0.5">
                        A/C: {maskAccountNumber(
                          findAccountNumberByCustomerName(
                            j?.customer_name || j?.customer || '', 
                            customersState?.list || []
                          )
                        )}
                      </p>
                    </td>

                    <td className="px-[14px] py-3">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold px-[10px] py-[3px] rounded-full ${typeStyle.bg} ${typeStyle.text}`}
                      >
                        {normalizedType}
                      </span>
                    </td>

                    <td className="px-[14px] py-3 text-[13px] text-[#374151]">
                      {j?.bank_name || j?.bank_code || j?.bank || '—'}
                    </td>

                    <td className="px-[14px] py-3 text-[11px] text-[#6b7280] whitespace-nowrap">
                      {/* ✅ Date from printHistory slice */}
                      {formatDateTime(j?.createdAtRaw || j?.created_at)}
                    </td>

                    <td className="px-[14px] py-3 font-mono text-[13px] text-[#dc2626] font-medium whitespace-nowrap">
                      {/* ✅ Charge from printHistory slice */}
                      {j?.charge !== undefined && j?.charge !== null && j?.charge !== ''
                        ? `-${j.charge}`
                        : '—'}
                    </td>

                    <td className="px-[14px] py-3 pr-5">
                      
                        <button
                          type="button"
                          onClick={() => handleReprint(j?.id || '')}
                          disabled={reprintingJobId !== null}
                          className="px-[9px] py-1 border-[1.5px] border-[#d1d5db] rounded-[5px] text-[11px] font-bold text-[#374151] bg-transparent hover:bg-[#f3f5f8] transition-colors whitespace-nowrap"
                        >
                          {reprintingJobId === j?.id ? 'Reprinting...' : 'Reprint'}
                        </button>
                     
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}