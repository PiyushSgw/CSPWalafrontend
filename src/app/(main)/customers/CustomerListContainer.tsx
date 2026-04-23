import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchCustomers } from "../../../redux/slices/customersSlice";
import { CustomerRow } from "./CustomerRow";

export const CustomerListSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mappedList, meta, loading, error, fetchedAt } =
    useAppSelector((s) => s.customers);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const load = (p: number, q: string) =>
    dispatch(fetchCustomers({ page: p, search: q, limit: 20 }));

  useEffect(() => { load(1, ""); }, []);

  const handleSearch = (val: string) => {
    setSearch(val); setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(1, val), 400);
  };

  const handlePage = (p: number) => { setPage(p); load(p, search); };

  const total = meta?.total ?? 0;
  const from = (page - 1) * 20 + 1;
  const to = Math.min(page * 20, total);
  const fetchLabel = fetchedAt
    ? `Fetched ${new Date(fetchedAt).toLocaleTimeString()}`
    : "";

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">All Customers ({total})</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {fetchLabel && (
            <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
              {fetchLabel}
            </span>
          )}
          <input
            placeholder="Name, account no., mobile..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 240 }}
          />
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th><th>Account No.</th>
              <th>Bank</th><th>Type</th>
              <th>Fetched At</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40 }}>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--color-text-danger)" }}>{error}</td></tr>
            ) : mappedList.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--color-text-secondary)" }}>No customers found</td></tr>
            ) : (
              mappedList.map((c) => <CustomerRow key={c.id} customer={c} />)
            )}
          </tbody>
        </table>
      </div>
      {meta && (
        <div style={{ padding: "12px 16px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
          <span>Showing {from}–{to} of {total}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => handlePage(page - 1)} disabled={page === 1}>← Prev</button>
            {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => handlePage(n)}
                style={n === page ? { background: "var(--color-background-info)" } : {}}>{n}</button>
            ))}
            <button onClick={() => handlePage(page + 1)} disabled={page === meta.totalPages}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
};