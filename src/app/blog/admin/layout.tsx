// This file defines the layout for the entire admin dashboard section (/blog/admin/*).
// It includes the sidebar navigation, the top header, and a route guard to protect the section.

// This component must be a Client Component because it uses hooks like `useEffect`, `useRouter`,
// and `usePathname` to handle client-side logic like authentication checks and navigation.
'use client';

// Import UI components for the sidebar layout.
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
// Import icons from the lucide-react library.
import { Home, Newspaper, MessageSquare, Pencil, Users, LogOut } from "lucide-react";
// Import Next.js components for navigation.
import Link from 'next/link';
import { useRouter, usePathname } from "next/navigation";
// Import UI components for user avatar and buttons.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// Import the custom hook for authentication. This is the core of our route protection.
import { useAuth } from "@/hooks/use-auth";
// Import React's `useEffect` hook for running side effects (like checking auth status).
import { useEffect } from "react";

// Define the navigation items for the sidebar.
// Each item includes a path, icon, label, and an array of roles that are allowed to see it.
// This makes the navigation structure clear and easy to manage.
const navItems = [
    { href: "/blog/admin", icon: <Home />, label: "Dashboard", roles: ['admin', 'editor'] },
    { href: "/blog/admin/posts", icon: <Newspaper />, label: "Posts", roles: ['admin', 'editor'] },
    { href: "/blog/admin/comments", icon: <MessageSquare />, label: "Comments", roles: ['admin', 'editor'] },
    { href: "/blog/admin/stories", icon: <Pencil />, label: "Stories", roles: ['admin', 'editor'] },
    { href: "/blog/admin/users", icon: <Users />, label: "Users", roles: ['admin'] } // Only admins can see this.
];

// This is the main layout component for the admin section.
// It wraps around the page components for each admin route (e.g., /blog/admin/posts/page.tsx).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Destructure values from our authentication hook.
  const { user, loading, logout, userRole } = useAuth();
  // Get the router instance to perform client-side navigation (redirects).
  const router = useRouter();
  // Get the current URL path to highlight the active sidebar link.
  const pathname = usePathname();

  // This `useEffect` hook is the route guard. It runs whenever the component mounts or
  // the dependencies (user, loading, userRole) change.
  useEffect(() => {
    // We only perform the check once the authentication state is no longer loading.
    if (!loading) {
      // If there is no logged-in user, or if the user's role is not 'admin' or 'editor',
      // we redirect them to the login page.
      if (!user || (userRole !== 'admin' && userRole !== 'editor')) {
        router.push('/login');
      }
    }
  }, [user, loading, userRole, router]); // Dependencies array for the hook.

  // While the auth state is loading, display a simple loading message.
  // This prevents a flash of the admin content before the auth check completes.
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }
  
  // After loading, if the user is still not authorized, show an "Access Denied" message.
  // This provides a better user experience than just a blank screen before the redirect happens.
  if (!user || (userRole !== 'admin' && userRole !== 'editor')) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6 text-muted-foreground">You do not have permission to view this page. Please log in as an admin or editor.</p>
            <Button asChild>
                <Link href="/login">Go to Login</Link>
            </Button>
        </div>
    );
  }

  // A helper function to determine the title of the current page based on the URL.
  const getPageTitle = () => {
    const currentPath = pathname.split('/').pop();
    if (!currentPath || currentPath === 'admin') return 'Dashboard';
    return currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
  };

  // If the user is authenticated and authorized, render the full admin layout.
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/blog/admin" className="flex items-center gap-2 font-semibold">
              <span className="">Travonex Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navItems.map((item) => (
                item.roles.includes(userRole!) && (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
                            pathname === item.href ? "bg-gray-200/50 text-gray-900 dark:bg-gray-800/50 dark:text-gray-50" : ""
                        }`}>
                        {item.icon}
                        {item.label}
                    </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link href="#" className="lg:hidden">
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()}>Logout</Button>
          {user && (
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
