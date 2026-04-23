"use client";

const actions = [
  {
    icon: "📖",
    name: "Print Passbook",
    desc: "Enter customer details and print passbook PDF",
    price: "₹5 / print",
    priceClass: "text-green-700",
    href: "/passbook",
  },
  {
    icon: "📋",
    name: "Account Opening Form",
    desc: "Fill and print bank account opening form",
    price: "₹10 / print",
    priceClass: "text-green-700",
    href: "/account-opening",
  },
  {
    icon: "🔗",
    name: "Combo Print",
    desc: "Form + Passbook together at discounted rate",
    price: "₹13 combo",
    priceClass: "text-green-700",
    href: "/account-opening",
  },
  {
    icon: "👤",
    name: "Add Customer",
    desc: "Register a new customer in the system",
    price: "Free",
    priceClass: "text-slate-400",
    href: "/customers",
  },
  {
    icon: "💳",
    name: "Recharge Wallet",
    desc: "Add balance to continue printing",
    price: "+ Add funds",
    priceClass: "text-blue-600",
    href: "/wallet",
  },
  {
    icon: "🗂️",
    name: "Print History",
    desc: "View all past print jobs and reprint",
    price: "View all",
    priceClass: "text-slate-400",
    href: "/print-history",
  },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
        ⚡ Quick Actions
      </h2>
      <div className="grid grid-cols-3 gap-2.5">
        {actions.map((a) => (
          <a
            key={a.name}
            href={a.href}
            className="
              bg-white border border-slate-200 rounded-xl p-4 text-center
                hover:border-[#0d8f72] hover:shadow-[0_4px_20px_rgba(34,197,94,0.12)]
              hover:-translate-y-0.5 transition-all duration-200 cursor-pointer block
            "
          >
            <div className="text-[28px] mb-2 leading-none">{a.icon}</div>
            <p className="text-[13px] font-semibold text-slate-800 mb-1 leading-tight">
              {a.name}
            </p>
            <p className="text-[11px] text-[#6b7280] leading-snug mb-2">{a.desc}</p>
            <p className={`text-[10px] font-semibold ${a.priceClass} rounded-full py-0.4 px-1.5 inline-block bg-[#e6f7f3]`}>
              {a.price}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
