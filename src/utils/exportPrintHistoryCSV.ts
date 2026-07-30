import type { MappedPrintJob } from "../app/(main)/print-history/printHistory";

export const exportPrintHistoryCSV = (jobs: MappedPrintJob[]) => {
  if (jobs.length === 0) return;

  const headers = [
    "Job ID",
    "Date/Time",
    "Customer",
    "Bank",
    "Type",
    "Pages",
    "Charge",
    "Status",
  ];

  const rows = jobs.map((job) => [
    job.id,
    job.dateTime,
    job.customer,
    job.bank,
    job.type,
    job.pages,
    job.charge,
    job.status,
  ]);

  const csvContent = [
    headers.join(","),

    ...rows.map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);

  link.href = url;

  link.download = `print-history-${new Date().toISOString().split("T")[0]
    }.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};