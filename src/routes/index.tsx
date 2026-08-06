import { createFileRoute } from "@tanstack/react-router";
import { Hero, Nav } from "@/components/landing/Hero";
import {
  Features,
  HowItWorks,
  Overview,
  Problem,
  Showcase,
} from "@/components/landing/SectionsA";
import {
  AnalyticsSection,
  Experiences,
  FAQ,
  FinalCTA,
  Footer,
  MapSection,
  TimelineShowcase,
} from "@/components/landing/SectionsB";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "docko. — Track your academic journey with daily verified achievements" },
      {
        name: "description",
        content:
          "docko. helps students track any academic journey, project, or lab work. Log daily milestones with real evidence and get your achievements verified every day by mentors.",
      },
      { property: "og:title", content: "docko. — Track your academic journey with daily verified achievements" },
      {
        property: "og:description",
        content:
          "Capture daily milestones, lab photos, and project progress. Faculty and mentors verify your achievements every day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      <Nav />
      <main>
        <Hero />
        <Overview />
        <Problem />
        <HowItWorks />
        <Showcase />
        <Features />
        <AnalyticsSection />
        <Experiences />
        <TimelineShowcase />
        <MapSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
