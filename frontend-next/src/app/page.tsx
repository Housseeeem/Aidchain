import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { TrustedBy } from "@/components/home/trusted-by";
import { NetworkVisualization } from "@/components/home/network-visualization";
import { DemoAuthButton } from "@/components/demo-auth-button";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <TrustedBy />
      <NetworkVisualization />
      <DemoAuthButton />
    </>
  );
}