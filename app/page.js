import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import GlobalPresence from "@/components/GlobalPresence";
import VisionChairman from "@/components/VisionChairman";
import CeoStatement from "@/components/CeoStatement";
import Companies from "@/components/Companies";
import BuiltForGrowth from "@/components/BuiltForGrowth";
import HowWeBuild from "@/components/HowWeBuild";
import IndependentExpertise from "@/components/IndependentExpertise";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutUs />
      <GlobalPresence />
      <VisionChairman />
      <CeoStatement />
      <Companies />
      <BuiltForGrowth />
      <HowWeBuild />
      <IndependentExpertise />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  );
}
