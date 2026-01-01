import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-accent fill-accent" />
              <span className="text-lg font-bold">NRI Christian Matrimony</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              A trusted platform for NRI Christians seeking meaningful, value-driven relationships. 
              Parents and well-wishers can create profiles for their loved ones.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="link-footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/profiles" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="link-footer-profiles">
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link href="/create-profile" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="link-footer-create">
                  Create Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">Denominations</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Catholic</li>
              <li>Protestant</li>
              <li>Orthodox</li>
              <li>Pentecostal</li>
              <li>Baptist</li>
              <li>Methodist</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="h-4 w-4 text-accent" />
                <span>+1(813)563-0060</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="h-4 w-4 text-accent" />
                <span>info@nrichristianmatrimony.com</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>19046 Bruce B Downs Blvd, #1376, Tampa, FL, 33647</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>NRI Christian Matrimony - Trusted Matchmaking for the Christian Community</p>
        </div>
      </div>
    </footer>
  );
}
