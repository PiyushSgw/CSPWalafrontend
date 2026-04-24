"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PageHeaderSection } from "./PageHeaderSection";
import { CustomerListSection } from "./CustomerListSection";
import { AddCustomerSection } from "./AddCustomerSection";

import { fetchCustomers } from "@/redux/slices/customersSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import { Customer, MappedCustomer } from "./customer";

export default function CustomersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { list, meta, loading, error } = useSelector(
    (state: RootState) => state.customers
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCustomers({ page: currentPage, limit: 20 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    if (!meta) return;
    if (page < 1 || page > meta.totalPages) return;
    setCurrentPage(page);
  };

  const mappedCustomers: MappedCustomer[] = useMemo(() => {
  return list.map((cust: Customer) => ({
    id: cust.id,
    name: cust.name,
    mobile: cust.mobile,
    account_number: cust.account_number,
    accountShort: cust.account_number
      ? `XXXX ${cust.account_number.slice(-4)}`
      : "XXXX",
    bank: cust.bank_code || cust.bank_name || "-",
    type:
      cust.account_type?.toLowerCase() === "savings"
        ? "Savings"
        : cust.account_type?.toLowerCase() === "current"
        ? "Current"
        : "Jan Dhan",
    lastPrint: cust.created_at
      ? new Date(cust.created_at).toLocaleDateString("en-IN")
      : "-",
    fetchedAt: cust.created_at || new Date().toISOString(),
  }));
}, [list]);

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) return mappedCustomers;

    return mappedCustomers.filter((cust) => {
      return (
        cust.name.toLowerCase().includes(q) ||
        cust.mobile.toLowerCase().includes(q) ||
        cust.accountShort.toLowerCase().includes(q) ||
        cust.bank.toLowerCase().includes(q)
      );
    });
  }, [mappedCustomers, searchTerm]);

  return (
    <div className="page active" id="page-customers">
      <PageHeaderSection />

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 8,
            background: "#fee2e2",
            color: "#b91c1c",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <div className="col-2-1" style={{ gap: 16, alignItems: "start" }}>
        <div>
          <CustomerListSection
            customers={filteredCustomers}
            meta={meta || undefined}
            loading={loading}           
          />
        </div>

        <div>
          <AddCustomerSection />
        </div>
      </div>
    </div>
  );
}