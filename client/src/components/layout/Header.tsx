import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/profiles", label: "Browse Profiles" },
  ];

  const authLinks = isAuthenticated
    ? [
        { href: "/create-profile", label: "Create Profile" },
        { href: "/my-profile", label: "My Profile" },
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
            <Heart className="h-7 w-7 text-accent fill-accent" />
            <span className="text-lg font-bold text-foreground">NRI Christian Matrimony</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "secondary" : "ghost"}
                size="sm"
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          {authLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "secondary" : "ghost"}
                size="sm"
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled>
              Loading...
            </Button>
          ) : isAuthenticated ? (
            <a href="/api/logout">
              <Button variant="outline" size="sm" data-testid="button-logout">
                Logout
              </Button>
            </a>
          ) : (
            <a href="/api/login">
              <Button size="sm" className="bg-accent text-accent-foreground" data-testid="button-login">
                Join Now
              </Button>
            </a>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card px-4 py-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated ? (
              <a href="/api/logout">
                <Button variant="outline" className="w-full" data-testid="button-mobile-logout">
                  Logout
                </Button>
              </a>
            ) : (
              <a href="/api/login">
                <Button className="w-full bg-accent text-accent-foreground" data-testid="button-mobile-login">
                  Join Now
                </Button>
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
