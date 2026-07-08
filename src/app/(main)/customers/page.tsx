"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PageHeaderSection } from "./PageHeaderSection";
import { CustomerListSection } from "./CustomerListSection";
import { AddCustomerSection } from "./AddCustomerSection";
import EditCustomerModal from "./EditCustomerModal";
import { exportCustomersCSV } from "../../../utils/exportCustomersCSV";

import {
  fetchCustomers,
  updateCustomer,
} from "@/redux/slices/customersSlice";

import type { RootState, AppDispatch } from "@/redux/store";
import { Customer, MappedCustomer } from "./customer";

export default function CustomersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { list, meta, loading, error } = useSelector(
    (state: RootState) => state.customers
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<MappedCustomer | null>(null);

  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch Customers
  useEffect(() => {
    dispatch(
      fetchCustomers({
        page: currentPage,
        limit: 20,
      })
    );
  }, [dispatch, currentPage]);

  // Handle Pagination
  const handlePageChange = (page: number) => {
    if (!meta) return;

    if (page < 1 || page > meta.totalPages) return;

    setCurrentPage(page);
  };

  // Map API Data
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

      type: (
        cust.account_type?.toLowerCase() === "savings"
          ? "Savings"
          : cust.account_type?.toLowerCase() === "current"
            ? "Current"
            : "Jan Dhan"
      ) as "Savings" | "Current" | "Jan Dhan",

      lastPrint: cust.created_at
        ? new Date(cust.created_at).toLocaleDateString("en-IN")
        : "-",

      fetchedAt:
        cust.created_at || new Date().toISOString(),
    }));
  }, [list]);

  // Search Filter
  const filteredCustomers = useMemo(() => {
    const q = searchTerm?.trim()?.toLowerCase() || "";

    if (!q) return mappedCustomers || [];

    return mappedCustomers.filter((cust) => {
      return (
        cust.name?.toLowerCase().includes(q) ||
        cust.mobile?.toLowerCase().includes(q) ||
        cust.accountShort?.toLowerCase().includes(q) ||
        cust.bank?.toLowerCase().includes(q)
      );
    });
  }, [mappedCustomers, searchTerm]);

  // Export CSV
  const handleExportCSV = () => {
    if (!filteredCustomers.length) return;

    const headers = [
      "Name",
      "Mobile",
      "Account Number",
      "Bank",
      "Type",
      "Last Print",
    ];

    const rows = filteredCustomers.map((cust) => [
      cust.name,
      cust.mobile,
      cust.account_number,
      cust.bank,
      cust.type,
      cust.lastPrint,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "customers.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // Edit Customer
  const handleEdit = (
    customer: MappedCustomer
  ) => {
    setSelectedCustomer(customer);

    setIsEditOpen(true);
  };

  // Update Customer
  const handleUpdate = async (
    updatedCustomer: MappedCustomer
  ) => {
    await dispatch(
      updateCustomer({
        id: updatedCustomer.id,

        name: updatedCustomer.name,

        mobile: updatedCustomer.mobile,

        account_number:
          updatedCustomer.account_number,

        account_type:
          updatedCustomer.type
            .toLowerCase()
            .replace(" ", "_"),
      })
    );

    setIsEditOpen(false);

    setSelectedCustomer(null);

    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);

    dispatch(
      fetchCustomers({
        page: currentPage,
        limit: 20,
      })
    );
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsEditOpen(false);

    setSelectedCustomer(null);
  };

  return (
    <div className="page active" id="page-customers">
      {/* Header */}
      <PageHeaderSection
        customers={filteredCustomers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onExportCSV={() => exportCustomersCSV(filteredCustomers)}
      />

      {/* Error */}
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

      {/* Update Success */}
      {updateSuccess && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 8,
            background: "#dcfce7",
            color: "#166534",
            fontSize: 14,
          }}
        >
          Customer updated successfully.
        </div>
      )}

      {/* Main Layout */}
      <div
        className="col-2-1"
        style={{
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Customer List */}
        <div>
          <CustomerListSection
            customers={filteredCustomers}
            meta={meta || undefined}
            loading={loading}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
          />
        </div>

        {/* Add Customer */}
        <div>
          <AddCustomerSection />
        </div>
      </div>

      {/* Edit Modal */}
      <EditCustomerModal
        isOpen={isEditOpen}
        onClose={handleCloseModal}
        editData={selectedCustomer}
        onUpdate={handleUpdate}
      />
    </div>
  );
}