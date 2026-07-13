import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin-Login — Bee Swiss",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-semibold text-cream-50">Bee Swiss</p>
          <p className="mt-1 text-sm text-cream-100/60">Admin-Bereich</p>
        </div>
        <div className="rounded-2xl bg-ink-800/60 p-8 ring-1 ring-cream-100/10">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
