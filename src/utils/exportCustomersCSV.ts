import { MappedCustomer } from "../app/(main)/customers/customer";

export const exportCustomersCSV = (
  customers: MappedCustomer[] = []
) => {

  // Prevent crash
  if (!customers || customers.length === 0) {
    alert("Customer not found");
    return;
  }

  const headers = [
    "Name",
    "Mobile",
    "Account Number",
    "Bank",
    "Type",
    "Last Print",
  ];

  const rows = customers.map((cust) => [
    cust.name || "",
    cust.mobile || "",
    cust.account_number || "",
    cust.bank || "",
    cust.type || "",
    cust.lastPrint || "",
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