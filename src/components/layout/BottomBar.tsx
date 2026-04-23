// "use client";

// /**
//  * BottomBar.tsx
//  * ──────────────────────────────────────────────────────────────
//  * Sticky footer bar shown on every page.
//  * Imported ONLY in (main)/layout.tsx — no page imports this.
//  *
//  * Shows at-a-glance stats and system status.
//  * In production: connect to a context or SWR hook for live data.
//  */

// import { Headphones } from "lucide-react";

// const stats = [
//   { label: "Today's Spend", value: "₹33" },
//   { label: "Prints Today",  value: "8" },
//   { label: "Wallet Balance", value: "₹485.00" },
//   { label: "Daily Limit",   value: "142 / 200" },
// ];

// export default function BottomBar() {
//   return (
//     <footer className="h-12 bg-white border-t border-slate-200 flex items-center px-6 gap-3 flex-shrink-0">

//       {/* ── Quick stat pills ──────────────────────── */}
//       {/*
//        * Each pill shows a label + value.
//        * flex-shrink-0 prevents them from collapsing on narrow screens.
//        */}
//       {stats.map((s) => (
//         <div
//           key={s.label}
//           className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1 flex-shrink-0"
//         >
//           <span className="text-[10.5px] text-slate-500 font-medium whitespace-nowrap">
//             {s.label}
//           </span>
//           <span className="text-[12px] font-bold text-slate-800 font-mono">
//             {s.value}
//           </span>
//         </div>
//       ))}

//       {/* Spacer */}
//       <div className="flex-1" />

//       {/* ── System online indicator ───────────────── */}
//       <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
//         {/*
//          * The green pulsing dot shows live system status.
//          * Uses Tailwind's built-in animate-pulse class.
//          */}
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
//         System Online · Last sync: 2 min ago
//       </div>

//       {/* ── Support button ────────────────────────── */}
//       <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[11.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0">
//         <Headphones size={12} />
//         Support
//       </button>

//     </footer>
//   );
// }
