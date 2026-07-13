"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MessageReadToggle({ messageId, read }: { messageId: string; read: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/admin/messages/${messageId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: !read }),
        });
        router.refresh();
        setLoading(false);
      }}
      className={`rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-60 ${
        read ? "bg-ink-900/10 text-ink-700" : "bg-honey-500 text-cream-50"
      }`}
    >
      {read ? "Als ungelesen markieren" : "Als gelesen markieren"}
    </button>
  );
}
