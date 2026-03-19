import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { SourcesBanner } from "@/components/landing/SourcesBanner";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SupportSection } from "@/components/landing/SupportSection";

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <SourcesBanner />
                <HowItWorks />
                <SupportSection />
            </main>
            <Footer />
        </>
    );
}
