import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ProblemSolution from "@/components/problem-solution";
import Features from "@/components/features";
import Plans from "@/components/plans";
import ContactForm from "@/components/contact-form";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <Plans />
        <ContactForm />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
