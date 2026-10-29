import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import GlobalPresence from "@/components/GlobalPresence";
import LeadershipMessage from "@/components/LeadershipMessage";
import Companies from "@/components/Companies";
import BuiltForGrowth from "@/components/BuiltForGrowth";
import HowWeBuildExpertise from "@/components/HowWeBuildExpertise";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutUs />
      <GlobalPresence />
      <LeadershipMessage />
      <Companies />
      <BuiltForGrowth />
      <HowWeBuildExpertise />
      <Footer />
    </main>
  );
}
