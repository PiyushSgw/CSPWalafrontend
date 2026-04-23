export function handleAuthError() {
  localStorage.removeItem("admin_token");
  // works in both Next.js app router and pages router
  window.location.href = "/login";
}

export const isAuthError = (msg: string) =>
  msg.toLowerCase().includes("token") ||
  msg.includes("401") ||
  msg.toLowerCase().includes("unauthorized");