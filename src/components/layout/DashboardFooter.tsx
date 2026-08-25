export default function DashboardFooter() {
  return (
    <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-center px-6 gap-4 flex-shrink-0 text-[11px] text-slate-400">
      <a href="/legal/terms-and-conditions" className="hover:text-slate-600 transition-colors">Terms</a>
      <span>·</span>
      <a href="/legal/privacy-policy" className="hover:text-slate-600 transition-colors">Privacy</a>
      <span>·</span>
      <a href="/legal/refund-cancellation-policy" className="hover:text-slate-600 transition-colors">Refund</a>
      <span>·</span>
      <a href="/legal/shipping-policy" className="hover:text-slate-600 transition-colors">Shipping</a>
      <span>·</span>
      <a href="/legal/contact-us" className="hover:text-slate-600 transition-colors">Contact</a>
      <span className="ml-2">© 2026 BcUnion.in</span>
    </footer>
  );
}
