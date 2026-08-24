import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { CostOfInactionSection } from "@/components/marketing/CostOfInactionSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { ProofSection } from "@/components/marketing/ProofSection";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <HeroSection />
      <CostOfInactionSection />
      <FeaturesSection />
      <ProofSection />
      <Footer />
    </main>
  );
}