// This component defines the footer for the entire website.
// It is designed to be reusable and is included in the main layout and other page layouts.

// Import React and necessary components.
import React from 'react';
import { Instagram, Linkedin } from 'lucide-react'; // Icons for social media links.
import Link from 'next/link'; // For client-side navigation.
import Image from 'next/image'; // For displaying images.

// The main Footer component.
export function Footer() {
  // Array of social media link objects. This makes it easy to add or remove links.
  const socialLinks = [
    { icon: <Instagram className="h-6 w-6" />, href: '#', 'aria-label': 'Instagram' },
    { icon: <Linkedin className="h-6 w-6" />, href: '#', 'aria-label': 'LinkedIn' },
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
