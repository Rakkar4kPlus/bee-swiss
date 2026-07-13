import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login — Bee Swiss",
};

export default function LoginPage() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <SectionHeading eyebrow="Kundenkonto" title="Login" align="center" />
        <div className="mt-8 rounded-2xl bg-cream-50 p-8 shadow-sm ring-1 ring-honey-200/60">
          <LoginForm />
        </div>
      </div>
    </Container>
  );
}
