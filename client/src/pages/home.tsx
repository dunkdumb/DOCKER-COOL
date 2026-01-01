import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Heart, Users, Search, Shield, MessageCircle, Award, 
  UserPlus, Filter, Smartphone, CheckCircle, ArrowRight,
  Clock, Sparkles, Lock, Headphones, Star, Quote
} from "lucide-react";

const denominations = [
  { name: "Catholic", subtitle: "Largest Community", description: "Catholics form the largest Christian community worldwide, rooted in ancient traditions and sacraments." },
  { name: "Protestant", subtitle: "Strong Fellowship", description: "Protestants emphasize scripture, faith, and community fellowship in worship and life." },
  { name: "Orthodox", subtitle: "Rich Traditions", description: "Orthodox Christians preserve ancient liturgies, icons, and centuries-old traditions of worship." },
  { name: "Pentecostal", subtitle: "Spirit-Filled Worship", description: "Pentecostal churches are known for vibrant worship, prayer, and emphasis on the Holy Spirit." },
  { name: "Baptist", subtitle: "Faith & Service", description: "Baptists focus on personal faith, baptism, and active service in their communities." },
  { name: "Methodist", subtitle: "Grace & Mission", description: "Methodists emphasize grace, mission work, and living out faith in daily life." },
];

const howItWorks = [
  { step: 1, title: "Strong Profile Presence", items: ["Upload authentic photos", "Highlight your personality", "Define partner preferences", "Complete identity verification"] },
  { step: 2, title: "Quality Matches Guaranteed", items: ["Intelligent match recommendations", "Lifestyle compatibility check", "Value and interest alignment", "Verified background matching"] },
  { step: 3, title: "Conversations Made Easy", items: ["Secure private messaging", "Express interest seamlessly", "Video interaction option", "Strong privacy safeguards"] },
  { step: 4, title: "Forever Starts Here", items: ["Guided relationship support", "Coordinated introductions", "Family involvement made easy", "Celebrate your perfect match"] },
];

const features = [
  { icon: Shield, title: "Verified Profiles Only", description: "Strict screening ensures you connect with genuine individuals." },
  { icon: Sparkles, title: "Intelligent Matchmaking", description: "Advanced technology pairs you with truly compatible partners." },
  { icon: Lock, title: "Top-Tier Privacy", description: "Your personal information is encrypted with the highest security standards." },
  { icon: MessageCircle, title: "Seamless Communication", description: "Chat, call, or video connect - all within a secure platform." },
  { icon: Award, title: "Proven Results", description: "Thousands of successful matches are a testament to our approach." },
  { icon: Headphones, title: "Dedicated Support Team", description: "Count on our experts for personalized assistance throughout your experience." },
];

const stats = [
  { value: "98%", label: "Success Stories", description: "Find love and compatibility; without delays." },
  { value: "24/7", label: "Member Assistance", description: "Dedicated support whenever you need us." },
  { value: "50+", label: "Compatibility Metrics", description: "Every match is based on science, not guesswork." },
  { value: "100%", label: "Authenticity", description: "Profiles are verified and secure, always." },
];

const testimonials = [
  { quote: "I loved that matches were selected based on personality and lifestyle, not monetary expectations. The platform felt professional and authentic.", names: "Grace & Daniel", location: "Clearwater", married: "July 2025", found: "6 weeks" },
  { quote: "It was more than a promise; it created a respectful and authentic environment to find my true love. Truly grateful for this platform.", names: "Rachel & Michael", location: "Brandon", married: "March 2025", found: "3 months" },
  { quote: "We appreciated that the platform values equality and genuine connections over traditions that divide. It worked wonderfully.", names: "Sophia & David", location: "Lakeland", married: "August 2025", found: "2 months" },
];

export default function Home() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="relative bg-primary text-primary-foreground py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Want a marriage built on <span className="text-accent">respect</span>, not rituals?
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                We know what you want: a genuine partner who values you, not your caste, community, or financial background. 
                We cut through outdated expectations so you can focus on finding a partner who truly fits your persona.
              </p>
              <a href="/api/login">
                <Button size="lg" className="bg-accent text-accent-foreground" data-testid="button-hero-join">
                  Join Now!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent font-medium mb-2">About NRI Christian Matrimony</p>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Redefining Matrimony with Clarity and Confidence</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                NRI Christian Matrimony has helped professionals find partners beyond caste or dowry, focusing on compatibility, 
                trust, and values through verified profiles, secure processes, and genuine connections.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: UserPlus, title: "Easy Registration", desc: "Quick & hassle-free signup" },
                { icon: Filter, title: "Smart Search Filters", desc: "Find matches that suit you" },
                { icon: Smartphone, title: "Mobile Friendly", desc: "Seamless access on all devices" },
                { icon: CheckCircle, title: "100% Verified", desc: "Trusted & authentic profiles" },
              ].map((item, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">Bridging Hearts with Technology</h3>
                <p className="text-muted-foreground mb-4">
                  We go beyond algorithms; we create an ecosystem of trust and recognize that choosing a life partner 
                  is among the most significant decisions in life.
                </p>
                <p className="text-muted-foreground">
                  Through AI-powered matching, comprehensive verification, and dedicated customer support, we guarantee 
                  that every interaction remains authentic, respectful, and aligned with your values.
                </p>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      To help individuals discover their ideal life partners through meaningful, secure, and value-driven connections.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Our Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      To become the world's most trusted matrimony platform, where innovative technology enhances genuine connections.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Connecting Believers Beyond Spiritual Boundaries</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Unity in Christ Across All Traditions. We honor God's diverse Body, guiding believers to find 
                Christ-centered life partners within all denominations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {denominations.map((denom) => (
                <Card key={denom.name} className="text-center hover-elevate cursor-default">
                  <CardContent className="pt-6">
                    <Heart className="h-8 w-8 text-accent mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">{denom.name}</h3>
                    <p className="text-xs text-accent font-medium mb-2">{denom.subtitle}</p>
                    <p className="text-xs text-muted-foreground">{denom.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent font-medium mb-2">How it Works</p>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">A Clear Roadmap to Your Happily Ever After</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We've made finding your soulmate simple, safe, and enjoyable.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howItWorks.map((step) => (
                <div key={step.step} className="relative">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-3">{step.title}</h3>
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                The partner you've been waiting for could be just a profile away.
              </p>
              <a href={isAuthenticated ? "/create-profile" : "/api/login"}>
                <Button size="lg" className="bg-accent text-accent-foreground" data-testid="button-create-profile-cta">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent font-medium mb-2">Our Features</p>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">The Difference We Bring</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every feature is designed with your trust and success in mind.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <feature.icon className="h-10 w-10 text-accent mb-4" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Where Success Isn't Just Claimed, It's Counted</h2>
              <p className="text-primary-foreground/80">
                Each statistic underscores our dedication to authentic, meaningful matches.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</div>
                  <div className="font-semibold mb-1">{stat.label}</div>
                  <p className="text-sm text-primary-foreground/70">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent font-medium mb-2">Success Stories</p>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Love That Lasts</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every match is unique. Here are some couples who found lasting relationships.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="relative">
                  <CardContent className="pt-8">
                    <Quote className="h-8 w-8 text-accent/20 absolute top-4 left-4" />
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.names}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex gap-4 flex-wrap text-xs text-muted-foreground">
                      <span>Married: {testimonial.married}</span>
                      <span>Found each other in {testimonial.found}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Be part of the countless couples who discovered true love here.
              </p>
              <a href={isAuthenticated ? "/create-profile" : "/api/login"}>
                <Button size="lg" className="bg-accent text-accent-foreground" data-testid="button-write-forever">
                  Write Your Forever
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-accent font-medium mb-2">Get In Touch</p>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Connect With Us</h2>
                <p className="text-muted-foreground mb-8">
                  Uncertain about the process? Our responsive team is always here to walk with you on your journey.
                </p>

                <div className="grid gap-4">
                  {[
                    { icon: Users, title: "Relationship Coaches", desc: "Professional counsellors ready to support and guide you." },
                    { icon: Heart, title: "Member Care Team", desc: "A dedicated team focused on making your journey smooth and personalized." },
                    { icon: Headphones, title: "Tech Assistance", desc: "Quick and reliable help for any platform-related queries." },
                  ].map((item, i) => (
                    <Card key={i}>
                      <CardContent className="flex items-start gap-4 pt-4 pb-4">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Ring Us</div>
                        <div className="text-muted-foreground">+1(813)563-0060</div>
                        <div className="text-sm text-muted-foreground">Mon-Sat, 9 AM - 8 PM</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Inbox Assist</div>
                        <div className="text-muted-foreground">info@nrichristianmatrimony.com</div>
                        <div className="text-sm text-muted-foreground">Response within 24 hours</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Headphones className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Quick Support</div>
                        <div className="text-muted-foreground">Available 24/7</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
