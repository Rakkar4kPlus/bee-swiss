"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await fetch("/api/customer/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      disabled={loading}
      className="rounded-full border border-honey-300 px-5 py-2.5 text-sm font-medium text-ink-800 hover:bg-honey-100 disabled:opacity-60"
    >
      {loading ? "Wird ausgeloggt…" : "Ausloggen"}
    </button>
  );
}
