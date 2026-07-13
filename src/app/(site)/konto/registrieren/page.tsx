import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Registrieren — Bee Swiss",
};

export default function RegisterPage() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <SectionHeading eyebrow="Kundenkonto" title="Konto erstellen" align="center" />
        <div className="mt-8 rounded-2xl bg-cream-50 p-8 shadow-sm ring-1 ring-honey-200/60">
          <RegisterForm />
        </div>
      </div>
    </Container>
  );
}
