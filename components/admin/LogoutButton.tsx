"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-1.5 rounded-md border border-card-border text-sm font-medium text-body hover:border-accent hover:text-accent transition-colors"
    >
      Log out
    </button>
  );
}
