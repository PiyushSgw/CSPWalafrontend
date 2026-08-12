"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import api from "@/utils/axios";
import { useAppSelector } from "@/redux/hooks";

type IssueType =
  | "Wallet / Payment Issue"
  | "Print Job Failed"
  | "Account Verification"
  | "Technical Problem"
  | "Other";

interface TicketForm {
  type: IssueType;
  subject: string;
  description: string;
}

const INITIAL_FORM: TicketForm = {
  type: "Other",
  subject: "",
  description: "",
};

export const SupportContactsSection: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [form, setForm] = useState<TicketForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value } as TicketForm));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (form.subject.trim().length < 3) {
      toast.error("Subject must be at least 3 characters");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Please describe your issue in detail");
      return;
    }
    if (form.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    setTicketId(null);

    try {
      const { data } = await api.post("/support/tickets", {
        issue_type: form.type,
        subject: form.subject,
        description: form.description,
      });

      const id: string = data?.data?.ticketId;
      setTicketId(id);
      setForm(INITIAL_FORM);
      toast.success(`Support Request Submitted Successfully. Ticket ID: ${id}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again later.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="card"
      style={{ margin: 0 }}
    >
      <div className="card-header">
        <div className="card-title">Submit a Support Ticket</div>
      </div>
      <div className="card-body">
        {user?.name && (
          <p className="form-hint" style={{ marginBottom: 14 }}>
            Submitting as <strong>{user.name}</strong> ({user.email})
          </p>
        )}

        {ticketId && (
          <div className="alert-box success" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 20 }}>✅</div>
            <div>
              <div className="qa-title" style={{ fontSize: 14 }}>
                Support Request Submitted Successfully
              </div>
              <div className="qa-desc">
                Your support request has been submitted successfully.
                <br />
                Ticket ID:{" "}
                <strong style={{ color: "var(--green)" }}>{ticketId}</strong>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className="form-group"
            style={{ marginBottom: 14 }}
          >
            <label className="form-label">Issue Type</label>
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option>Wallet / Payment Issue</option>
              <option>Print Job Failed</option>
              <option>Account Verification</option>
              <option>Technical Problem</option>
              <option>Other</option>
            </select>
          </div>
          <div
            className="form-group"
            style={{ marginBottom: 14 }}
          >
            <label className="form-label">
              Subject <span className="req">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief description of issue"
              maxLength={200}
            />
          </div>
          <div
            className="form-group"
            style={{ marginBottom: 16 }}
          >
            <label className="form-label">
              Detailed Description <span className="req">*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your issue in detail..."
              maxLength={5000}
            />
          </div>
          <button
            className="btn btn-teal"
            type="submit"
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Submitting...
              </>
            ) : (
              "Submit Ticket"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
