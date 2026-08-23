import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <Skills />
      <GitHubSection />
      <Contact />
    </>
  );
}
