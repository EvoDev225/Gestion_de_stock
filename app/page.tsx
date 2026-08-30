import Navbar from "@/components/marketing/Navbar";
import HeroSection from "@/components/marketing/HeroSection";
import StatsSection from "@/components/marketing/StatsSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import Footer from "@/components/marketing/Footer";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}