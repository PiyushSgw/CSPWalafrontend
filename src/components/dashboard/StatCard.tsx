type Props = {
  label: string;
  value: string;
  prefix?: string;
  sub: string;
  icon: string;
 accent: "green" | "yellow" | "blue" | "sky";
  subVariant: "positive" | "neutral";
};

const accentGradients: Record<Props["accent"], string> = {
    green:  "from-[#0d8f72] to-[#0d8f72]",
 yellow: "from-[#d97706] to-[#b45309]",
  blue:   "from-[#0f2744] to-[#0f2744]",
  sky:    "from-[#0284c7] to-[#0369a1]",
};

export default function StatCard({ label, value, prefix, sub, icon, accent, subVariant }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 relative overflow-hidden shadow-sm">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accentGradients[accent]}`} />

      <div className="flex items-center justify-between mb-2">
       <span className="text-[11px] font-semibold tracking-[0.8px] uppercase text-[#6b7280]" data-testid="stat-label">
          {label}
        </span>
        <span className="text-lg opacity-60" data-testid="stat-icon">{icon}</span>
      </div>

      <p className="text-[26px] font-medium text-[#111827] font-mono leading-none font-weight-500" data-testid="stat-value">
        {prefix && <span className="text-[11px] text-slate-500" data-testid="stat-prefix">{prefix}</span>}
        {value}
      </p>

      <p className={`text-[11px] font-normal mt-1.5 ${subVariant === "positive" ? "text-[#16a34a]" : "text-[#6b7280]"}`} data-testid="stat-sub">
        {sub}
      </p>
    </div>
  );
}
