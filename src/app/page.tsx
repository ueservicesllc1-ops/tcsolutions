import { AboutSection } from "@/components/site/about-section";
import { ContactSection } from "@/components/site/contact-section";
import { CtaStrip } from "@/components/site/cta-strip";
import { FeaturedServicesSection } from "@/components/site/featured-services-section";
import { Footer } from "@/components/site/footer";
import { ChatWidget } from "@/components/site/chat-widget";
import { Header } from "@/components/site/header";
import { HeroSection } from "@/components/site/hero-section";
import { ServicesSection } from "@/components/site/services-section";
import { WhyUsSection } from "@/components/site/why-us-section";

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyUsSection />
        <FeaturedServicesSection />
        <AboutSection />
        <CtaStrip />
        <ContactSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
