import HeroSection from "@/components/shared/hero-section";
import { ProtectedPage } from "@/app/auth/protected-page";

export default function LandingPage() {
  return (
    <ProtectedPage requireAuth={false}>
      <main>
        <HeroSection />
      </main>
    </ProtectedPage>
  );
}
