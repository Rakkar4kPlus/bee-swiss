import { prisma } from "@/lib/prisma";
import { MessageReadToggle } from "@/components/admin/MessageReadToggle";

export const metadata = {
  title: "Nachrichten — Admin",
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Kontaktnachrichten
      </h1>

      {messages.length === 0 ? (
        <p className="mt-6 text-ink-700/70">Noch keine Nachrichten eingegangen.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-2xl p-6 shadow-sm ring-1 ring-honey-200/60 ${
                message.read ? "bg-cream-50" : "bg-honey-50"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink-900">{message.name}</p>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-honey-700 hover:underline"
                  >
                    {message.email}
                  </a>
                  <p className="mt-1 text-xs text-ink-700/50">
                    {new Intl.DateTimeFormat("de-CH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(message.createdAt)}
                  </p>
                </div>
                <MessageReadToggle messageId={message.id} read={message.read} />
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-ink-800">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
