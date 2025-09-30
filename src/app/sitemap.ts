// This file is used by Next.js to dynamically generate a `sitemap.xml` file.
// A sitemap is important for SEO as it helps search engines like Google
// understand the structure of your site and discover all your pages.

// Import the `MetadataRoute` type from Next.js for type safety.
import { MetadataRoute } from 'next'
 
// The default export of this file must be a function named `sitemap`.
export default function sitemap(): MetadataRoute.Sitemap {
  // It is crucial to replace this with your actual production domain.
  // Search engines use this base URL to construct the full URLs for your pages.
  const baseUrl = 'https://www.travonex.com';

  // The function must return an array of sitemap entry objects.
  // In a real application, you would dynamically fetch all your published blog post slugs
  // from the database here and map them to sitemap entries.
  return [
    {
      url: baseUrl, // The URL of the homepage.
      lastModified: new Date(), // When the content was last updated.
      changeFrequency: 'monthly', // How often the content is likely to change.
      priority: 1, // The priority of this URL relative to other URLs on your site (1.0 is highest).
    },
    // Example of how you would add other static pages.
    // { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]
}
