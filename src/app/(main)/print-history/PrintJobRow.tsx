import React, { useState } from "react";
import type { MappedPrintJob } from "./printHistory";
import api from "@/utils/axios";
import toast from "react-hot-toast";

type JobTypeLabel = MappedPrintJob["type"];
const JobTypeBadge: React.FC<{ type: JobTypeLabel }> = ({ type }) => {
  const isNavy = ["Passbook", "Acct Form", "Jan Dhan"].includes(type);
  return <span className={`badge ${isNavy ? "navy" : "sky"}`}>{type}</span>;
};

const statusClass: Record<MappedPrintJob["status"], string> = {
  Printed: "badge green",
  Failed:  "badge red",
  Pending: "badge amber",
};

export const PrintJobRow: React.FC<MappedPrintJob> = ({
  id, jobId, dateTime, customer, bank, type, pages, charge, status, isFree,
}) => {
  const [reprinting, setReprinting] = useState(false);

  const handleReprint = async () => {
    if (reprinting) return;
    
    try {
      setReprinting(true);
      const response = await api.post(`/csp/passbook/reprint/${id}`);
      
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
      setReprinting(false);
    }
  };

  return (
    <tr>
      <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)" }}>
        {jobId}
      </td>
      <td style={{ fontSize: 12 }}>{dateTime}</td>
      <td style={{ fontWeight: 500 }}>{customer}</td>
      <td>{bank}</td>
      <td><JobTypeBadge type={type} /></td>
      <td style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{pages}</td>
      <td style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-danger)", fontSize: 13 }}>
        {charge}
      </td>
      <td><span className={statusClass[status]}>{status}</span></td>
      <td>
        <button 
          onClick={handleReprint}
          disabled={reprinting || status !== 'Printed'}
          className={`btn ${isFree ? "btn-teal" : "btn-outline"} btn-xs`}
        >
          {reprinting ? 'Reprinting...' : `Reprint${isFree ? ' (Free)' : ''}`}
        </button>
      </td>
    </tr>
  );
};