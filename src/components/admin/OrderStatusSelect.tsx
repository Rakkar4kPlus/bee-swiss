"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderStatusLabel } from "@/lib/format";

const STATUSES = ["NEU", "IN_BEARBEITUNG", "ERLEDIGT"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <select
      value={status}
      disabled={loading}
      onChange={async (e) => {
        setLoading(true);
        await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: e.target.value }),
        });
        router.refresh();
        setLoading(false);
      }}
      className="rounded-full border border-honey-300 bg-cream-50 px-3 py-1.5 text-xs font-medium text-ink-800 disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {orderStatusLabel(s)}
        </option>
      ))}
    </select>
  );
}
