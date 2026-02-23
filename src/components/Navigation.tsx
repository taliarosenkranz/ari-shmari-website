import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { createPageUrl } from "@/lib/pageUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  onBookDemo: () => void;
}

export default function Navigation({ onBookDemo }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-2xl font-bold text-primary hover-elevate active-elevate-2 px-3 py-1 rounded-md"
            data-testid="link-home"
          >
            ARI
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-features"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-how-it-works"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-contact"
            >
              Contact
            </button>
            <a
              href={`${import.meta.env.BASE_URL}privacy`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </a>
            
            {/* Authentication buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <UserCircle className="w-4 h-4" />
                    <span className="max-w-[150px] truncate text-sm">
                      {user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setLocation(createPageUrl('Events'))}>
                    My Events
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation(createPageUrl('CreateEvent'))}>
                    Create Event
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="gap-2"
                onClick={() => setLocation(createPageUrl('SignIn'))}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}

            <Button
              onClick={onBookDemo}
              variant="default"
              data-testid="button-nav-demo"
            >
              Book a Demo
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md"
              data-testid="link-mobile-features"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md"
              data-testid="link-mobile-how-it-works"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md"
              data-testid="link-mobile-contact"
            >
              Contact
            </button>
            <a
              href={`${import.meta.env.BASE_URL}privacy`}
              className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md"
              data-testid="link-mobile-privacy"
            >
              Privacy
            </a>
            
            {/* Mobile auth buttons */}
            {user ? (
              <>
                <button
                  onClick={() => {
                    setLocation(createPageUrl('Events'));
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md"
                >
                  My Events
                </button>
                <button
                  onClick={() => {
                    setLocation(createPageUrl('CreateEvent'));
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md"
                >
                  Create Event
                </button>
                <div className="px-3 py-2 text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-destructive hover-elevate rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setLocation(createPageUrl('SignIn'));
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </button>
            )}
            
            <Button
              onClick={() => { onBookDemo(); setIsMobileMenuOpen(false); }}
              variant="default"
              className="w-full"
              data-testid="button-mobile-demo"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
