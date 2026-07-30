/**
 * src/app/page.tsx (root page)
 * Redirects "/" to the public BcUnion.in landing page.
 */
import { redirect } from 'next/navigation';

export default function Home() {
  // The public BcUnion.in landing page is the default entry point.
  // Users log in / register from there.
  redirect('/user');
}