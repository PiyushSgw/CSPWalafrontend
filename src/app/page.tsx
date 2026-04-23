/**
 * src/app/page.tsx  (root page)
 * ──────────────────────────────
 * The root URL "/" has nothing to show on its own.
 * We immediately redirect to /dashboard.
 *
 * redirect() is a Next.js server-side helper — no JavaScript
 * runs on the client; the redirect happens during rendering.
 */
// import { redirect } from "next/navigation";

// export default function RootPage() {
//   redirect("/dashboard");
// }
import { redirect } from 'next/navigation';

export default function Home() {
  // Token check server side ya middleware se
  redirect('/login');
}