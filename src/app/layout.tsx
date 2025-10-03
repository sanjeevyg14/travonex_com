// This file is the root layout for the entire application.
// It wraps every page, providing a consistent HTML structure, global styles, and context providers.

// Import the `Metadata` type from Next.js for defining page metadata.
import type { Metadata } from 'next';
// Import the global stylesheet. This is the only place it should be imported.
import './globals.css';
// Import the Toaster component, which is responsible for displaying toast notifications.
import { Toaster } from "@/components/ui/toaster";
// Import the custom AuthProvider. Wrapping the entire app in this provider
// makes the authentication state available to all components.
import { AuthProvider } from '@/hooks/use-auth';
import Script from 'next/script';

// The `metadata` object defines the default SEO metadata for the application.
// Pages can override these values, but this provides a good starting point.
export const metadata: Metadata = {
  title: 'Travonex – Plan Less. Travel More. Curated Getaways & Weekend Trips',
  description: 'Discover curated weekend getaways, road trips, and group adventures with Travonex. Verified trip organizers, zero stress planning, and seamless bookings.',
  keywords: ['weekend trips', 'curated getaways', 'road trips', 'travel experiences', 'group trips', 'adventure travel', 'backpacking India', 'verified trip organizers', 'travel communities', 'Bangalore weekend trips', 'India travel aggregator', 'stress-free travel', 'solo travel groups', 'hiking trips', 'bike trips', 'Travonex'],
  // Open Graph metadata is used for social media sharing previews (e.g., Facebook, LinkedIn).
  openGraph: {
    title: 'Travonex – Curated Weekend Trips & Verified Travel Organizers',
    description: 'Plan less, travel more. Join curated group trips and weekend getaways with trusted organizers on Travonex.',
    url: 'https://www.travonex.com', // The canonical URL for the site.
    siteName: 'Travonex',
    images: [
      {
        url: 'https://www.travonex.com/og-image.jpg', // A specific image for social sharing.
        width: 1200,
        height: 630,
        alt: 'A beautiful travel destination for a weekend trip.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Twitter-specific metadata for Twitter card previews.
  twitter: {
    card: 'summary_large_image',
    title: 'Travonex – Curated Weekend Trips & Verified Organizers',
    description: 'Discover curated getaways and group trips with verified organizers. Stress-free travel starts with Travonex.',
    images: ['https://www.travonex.com/twitter-image.jpg'],
  },
  // Instructions for web crawlers (e.g., Googlebot).
  robots: {
    index: true, // Allow crawlers to index the site.
    follow: true, // Allow crawlers to follow links from the site.
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// This is the RootLayout component.
// `children` will be the content of the currently active page.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The `lang="en"` attribute is important for accessibility and SEO.
    // `!scroll-smooth` uses the `!` important modifier to ensure smooth scrolling behavior.
    <html lang="en" className="!scroll-smooth">
      <head>
        {/* Preconnect hints for Google Fonts to improve font loading performance. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The actual stylesheet for the Poppins and PT Sans fonts used in the app. */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      {/* `font-body` applies the default body font from Tailwind config. `antialiased` improves font rendering. */}
      <body className="font-body antialiased">
        {/* Wrap the entire application in the AuthProvider. */}
        <AuthProvider>
            {/* Render the current page's content. */}
            {children}
            {/* The Toaster component is placed here to be available on all pages. */}
            <Toaster />
        </AuthProvider>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-C6KSX10G84"></Script>
        <Script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-C6KSX10G84');
          `}
        </Script>
      </body>
    </html>
  );
}
