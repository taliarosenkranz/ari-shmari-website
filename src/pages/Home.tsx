import { useState } from "react";
import Navigation from "@/components/Navigation";
import WhatsAppChat from "@/components/WhatsAppChat";
import ProblemCard from "@/components/ProblemCard";
import SolutionStep from "@/components/SolutionStep";
import DashboardPreview from "@/components/DashboardPreview";
import BookDemoModal from "@/components/BookDemoModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Users,
  Brain,
  Clock,
  Upload,
  Settings,
  MessageCircle,
  BarChart3,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookDemo={() => setIsModalOpen(true)} />

      <section
        id="hero"
        className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight">
                  Let ARI handle your event chaos —{" "}
                  <span className="text-primary">one WhatsApp at a time.</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  No more manual messaging, guest confusion, or endless follow-ups. Just upload
                  your guest list, and ARI does the rest.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={() => setIsModalOpen(true)}
                  data-testid="button-hero-try"
                >
                  Try ARI
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => scrollToSection("how-it-works")}
                  data-testid="button-hero-learn"
                >
                  See How It Works
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <WhatsAppChat />
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Let's be honest. Event planning can be a mess.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ProblemCard
              icon={MessageSquare}
              title="Manual Messaging"
              description="Sending hundreds of WhatsApp messages manually"
            />
            <ProblemCard
              icon={Users}
              title="Lost Track"
              description="Losing track of who's coming (and who's ghosting)"
            />
            <ProblemCard
              icon={Brain}
              title="Repetitive Questions"
              description="Answering the same guest questions over and over"
            />
            <ProblemCard
              icon={Clock}
              title="Manual Updates"
              description="Updating clients manually, every. single. time."
            />
          </div>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
            It's exhausting. You want to focus on the event, not spreadsheets and chats.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Meet ARI — your AI assistant for guest communication.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All you need is one Excel sheet with names and phone numbers. ARI handles everything
              from there.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <SolutionStep
              icon={Upload}
              title="Upload Guest List"
              description="Simple Excel file with names and numbers"
              stepNumber={1}
            />
            <SolutionStep
              icon={Settings}
              title="ARI Sets Up"
              description="Automated WhatsApp invites configured instantly"
              stepNumber={2}
            />
            <SolutionStep
              icon={MessageCircle}
              title="Guests RSVP"
              description="Everyone responds directly in chat"
              stepNumber={3}
            />
            <SolutionStep
              icon={BarChart3}
              title="Real-Time Updates"
              description="Client sees live status on dashboard"
              stepNumber={4}
            />
          </div>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
            No coding. No stress. Just plug in your data and watch the magic happen.
          </p>
        </div>
      </section>

      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Want to go deeper? ARI knows your event like you do.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              With our advanced setup, you can feed ARI every event detail — from dress code to
              gift preferences, from hotel suggestions to timing.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">What ARI can handle:</h3>
                <ul className="space-y-3">
                  {[
                    "Location & schedule details",
                    "Dress code & theme",
                    "Accommodation options",
                    "Gift registry or payment links",
                    "Custom RSVP buttons",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <p className="text-muted-foreground">
                That way, when guests ask questions, ARI answers instantly and correctly — 24/7.
              </p>
            </div>

            <div className="bg-[#0a1014] rounded-3xl p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-muted text-muted-foreground rounded-tr-sm">
                    <p className="text-sm">Hey, what's the dress code again?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-primary text-primary-foreground rounded-tl-sm">
                    <p className="text-sm">
                      It's formal — think black tie or cocktail chic 👗🎩
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Everything tracked. Nothing lost.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ARI gives you a clean desktop dashboard where you can see every guest's RSVP status,
              questions, and payment — in real time.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section id="planners" className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
            Perfect for event agencies and planners.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're managing a wedding, corporate event, or private dinner — ARI keeps
            guests happy and your client informed.
          </p>
          <p className="text-lg text-foreground mb-8">
            Save hours every week and impress clients with your 'AI-enhanced service'.
          </p>
        </div>
      </section>

      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
            Let ARI handle your next event.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Upload your guest list today and experience stress-free event communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => setIsModalOpen(true)}
              data-testid="button-cta-start"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => setIsModalOpen(true)}
              data-testid="button-cta-demo"
            >
              Book a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No setup cost. No coding. Just peace of mind.
          </p>
        </div>
      </section>

      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-2xl font-bold text-primary mb-4">ARI</p>
          <p className="text-sm text-muted-foreground">
            Your AI-powered event assistant. Making event planning effortless.
          </p>
        </div>
      </footer>

      <BookDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
