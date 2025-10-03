// This component defines the footer for the entire website.
// It is designed to be reusable and is included in the main layout and other page layouts.

// Import React and necessary components.
import React from 'react';
import { Instagram, Linkedin, Youtube, Facebook, Twitter } from 'lucide-react'; // Icons for social media links.
import Link from 'next/link'; // For client-side navigation.
import Image from 'next/image'; // For displaying images.

// The main Footer component.
export function Footer() {
  // Array of social media link objects. This makes it easy to add or remove links.
  const socialLinks = [
    { icon: <Youtube className="h-6 w-6" />, href: 'https://www.youtube.com/@Travonex', 'aria-label': 'Youtube' },
    { icon: <Twitter className="h-6 w-6" />, href: 'https://www.linkedin.com/company/travonex', 'aria-label': 'Twitter' },
    { icon: <Facebook className="h-6 w-6" />, href: 'https://www.facebook.com/profile.php?id=61581171023347', 'aria-label': 'Facebook' },
    { icon: <Instagram className="h-6 w-6" />, href: 'https://www.instagram.com/travonex', 'aria-label': 'Instagram' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.165-.67-.165l-.67-.165s-.273-.099-.273-.099c-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164C3.06 7.843 3 8.36 3 9.382c0 1.02.53 1.903 1.255 2.585.725.682 1.59 1.164 2.39 1.475.798.312 1.48.463 2.058.463.578 0 1.157-.15 1.653-.463.497-.312.94-.788 1.255-1.475.315-.682.465-1.59.465-2.585 0-1.02-.173-1.542-.47-1.84s-.644-.448-.94-.52c-.297-.075-.67-.075-.67-.075z" /></svg>, href: 'https://wa.me/919008114928', 'aria-label': 'Whatsapp' },
  ];
  
  // Array of navigation link objects for the footer.
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '#about', label: 'About' }, // Hash links for scrolling to sections on the homepage.
    { href: '#community', label: 'Community' },
    { href: '#signup', label: 'Sign Up' },
  ];

  // The JSX structure of the footer.
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Column 1: Logo and tagline. */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link href="/">
              <Image src="/travonex-logo-footer.png" alt="Travonex" width={150} height={40} style={{ height: 'auto' }} />
            </Link>
            <p className="text-background/70">Plan Less. Travel More.</p>
          </div>
          
          {/* Column 2: Quick Links navigation. */}
          <div className="space-y-4">
            <h4 className="font-semibold font-headline tracking-wider uppercase text-background/80">Quick Links</h4>
            <ul className="space-y-2">
              {/* Map over the `navLinks` array to render the list of links. */}
              {navLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social media icons. */}
          <div className="space-y-4 flex flex-col items-center md:items-end">
            <h4 className="font-semibold font-headline tracking-wider uppercase text-background/80">Follow Us</h4>
            <div className="flex items-center gap-4">
              {/* Map over the `socialLinks` array to render the icons. */}
              {socialLinks.map((link, i) => (
                <Link key={i} href={link.href} aria-label={link['aria-label']} className="text-background/70 hover:text-primary transition-colors">
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section of the footer with legal information. */}
        <div className="mt-16 pt-8 border-t border-background/20 text-center text-sm text-background/60 space-y-4">
          {/* The `address` tag is semantically correct for contact/address information. */}
          <address className="not-italic max-w-2xl mx-auto">
            <span className="font-bold">Registered Office:</span> Wanderlynx Labs LLP, UNIT 101, OXFORD TOWERS, 139, HAL OLD AIRPORT RD, Hulsur Bazaar, Halasuru Traffic Police Station, Bangalore North, Bangalore – 560008, Karnataka, India
          </address>
          <p>
            © 2025 Travonex — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
