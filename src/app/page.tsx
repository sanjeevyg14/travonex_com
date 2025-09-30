// This file is the homepage of the application.
// It serves as the main landing page, showcasing the brand's value proposition.

// Import necessary components from Next.js and the project's UI library.
import Link from 'next/link'; // For client-side navigation.
import Image from 'next/image'; // For optimized images.
import { Button } from '@/components/ui/button'; // The standard button component.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Card components for layout.
import { Header } from '@/components/landing/header'; // The site's main header.
import { Footer } from '@/components/landing/footer'; // The site's main footer.
import { SignupForm } from '@/components/landing/signup-form'; // The early access signup form component.
import { Compass, ShieldCheck, Zap, Users } from 'lucide-react'; // Icons from lucide-react.

// This is a Server Component by default in the Next.js App Router.
// It fetches no data, so it's purely presentational.
export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section: The main section at the top of the page. */}
        <section className="relative py-28 md:py-40 text-center overflow-hidden">
          {/* A decorative background gradient. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-secondary opacity-80"></div>
          <div className="container mx-auto relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight text-foreground">
              Plan Less. Travel More.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
              Discover curated weekend getaways, road trips, and group adventures with Travonex. Verified trip organizers, zero stress planning, and seamless bookings.
            </p>
            {/* Call-to-action buttons. */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" className="rounded-2xl px-8 py-6 font-bold hover:scale-105 transition-transform" asChild>
                <Link href="https://chat.whatsapp.com/IGMcYhUUjJBF2MYOGLvrOp">Join WhatsApp Community</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl px-8 py-6 font-bold hover:scale-105 transition-transform" asChild>
                <Link href="#signup">Sign up for Early Access</Link>
              </Button>
            </div>
            {/* A large hero image. */}
            <div className="mt-16 relative w-full max-w-4xl mx-auto">
              <Image 
                src="https://images.unsplash.com/photo-1609864486219-2032ffac0643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxQdXQlMjBzb21lJTIwaW1hZ2UlMjByZWxhdGVkJTIwdG8lMjB0cmF2ZWwlMjBuYXR1cmV8ZW58MHx8fHwxNzU3MzM2NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Backpack against a mountain backdrop for a weekend trip"
                width={1200}
                height={600}
                className="rounded-2xl shadow-2xl"
                data-ai-hint="backpack mountains" // A hint for AI-powered image replacement tools.
              />
            </div>
          </div>
        </section>

        {/* About Travonex Section: Explains the company's mission and features. */}
        <section id="about" className="py-24 md:py-32 bg-secondary">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold font-headline">About Travonex</h2>
                <p className="text-lg text-muted-foreground">
                  Our mission is to simplify travel planning by offering unique, curated weekend trips with trusted organizers, ensuring every getaway is seamless and memorable. We handle the details, so you can focus on the adventure.
                </p>
              </div>
              {/* Grid of key features. */}
              <div className="grid grid-cols-2 gap-8">
                {aboutFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold font-headline">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section: A simple 3-step process illustration. */}
        <section id="how-it-works" className="py-24 md:py-32">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">How It Works</h2>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step) => (
                <Card key={step.title} className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl border-none p-6 hover:-translate-y-2">
                  <CardHeader className="items-center">
                    <div className="text-5xl mb-4">{step.icon}</div>
                    <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Community Invitation Section: A call-to-action to join the WhatsApp community. */}
        <section id="community" className="py-24 md:py-32">
           <div className="container mx-auto">
              <div className="max-w-4xl mx-auto text-center bg-primary text-white p-10 md:p-16 rounded-2xl shadow-xl">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">
                  We’re in the early building stage 🚧
                </h2>
                <p className="mt-4 text-lg max-w-2xl mx-auto">
                  Join our growing tribe, share feedback, and co-build the future of travel!
                </p>
                <div className="mt-8">
                  <Button size="lg" variant="outline" className="rounded-2xl px-8 py-6 font-bold bg-white text-primary hover:bg-gray-100 hover:text-primary hover:scale-105 transition-transform" asChild>
                    <Link href="https://chat.whatsapp.com/IGMcYhUUjJBF2MYOGLvrOp?mode=ems_copy_c">Join WhatsApp Community</Link>
                  </Button>
                </div>
              </div>
            </div>
        </section>

        {/* Signup Form Section: The early access signup form. */}
        <section id="signup" className="py-24 md:py-32 bg-secondary">
          <div className="container mx-auto">
            <SignupForm />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

// Data for the 'About' section. Keeping static data like this in the component file is fine for small sites.
// For larger applications, this might be moved to a separate `data` or `constants` file.
const aboutFeatures = [
  {
    icon: <Compass className="h-6 w-6" />,
    title: "Curated Trips",
    description: "Handpicked unique experiences."
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Verified Organizers",
    description: "Travel with trusted partners."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Stress-Free Booking",
    description: "Seamless and easy booking."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Growing Community",
    description: "Connect with fellow travelers."
  },
];

// Data for the 'How It Works' section. Using emojis as icons is a simple and effective choice.
const howItWorksSteps = [
    { icon: "🧭", title: "Discover Curated Trips", description: "Browse unique weekend trips that match your style." },
    { icon: "🌍", title: "Book & Connect", description: "Book your spot or connect with organizers." },
    { icon: "⚡", title: "Travel Stress-Free", description: "Enjoy a memorable, well-planned experience." },
];
