import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "react-hot-toast";
import { reprintPassbook } from "@/redux/slices/printHistorySlice";
import type { MappedPrintJob } from "./printHistory";

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
  id, dateTime, customer, bank, type, pages, charge, status, isFree,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.printHistory);
  const [isReprinting, setIsReprinting] = React.useState(false);

  const handleReprint = async () => {
    if (isReprinting || loading) return;
    
    setIsReprinting(true);
    try {
      const result = await dispatch(reprintPassbook({ jobId: Number(id.replace('#', '')) }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        // Open PDF in new tab
        if (typeof result.payload === 'object' && result.payload?.data?.pdf_signed_url) {
          window.open(result.payload.data.pdf_signed_url, '_blank');
        }
        toast.success((typeof result.payload === 'object' ? result.payload?.message : '') || 'Reprint successful!');
      } else if (result.meta.requestStatus === 'rejected') {
        const errorMessage = typeof result.payload === 'string' ? result.payload : 'Reprint failed';
        
        // Show specific message for job not found
        if (errorMessage.includes('Print job not found') || errorMessage.includes('Not Found')) {
          toast.error('Print job not found. The job may have been deleted or expired.');
        } else if (errorMessage.includes('No auth token')) {
          toast.error('Authentication required. Please login again.');
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('Reprint failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Reprint failed');
    } finally {
      setIsReprinting(false);
    }
  };

  return (
    <tr>
      <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)" }}>
        {id}
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
          disabled={isReprinting}
          className={`btn ${isFree ? "btn-teal" : "btn-outline"} btn-xs`}
        >
          {isReprinting ? 'Reprinting...' : `Reprint${isFree ? " (Free)" : ""}`}
        </button>
      </td>
    </tr>
  );
};