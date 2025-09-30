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
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/blog/admin">
              <h2 className="text-2xl font-bold font-headline text-primary">Travonex Admin</h2>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {/* Map over the `navItems` array to render the sidebar menu. */}
              {navItems.map((item) => (
                // Only render the menu item if the current user's role is included in the item's `roles` array.
                item.roles.includes(userRole!) && (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton href={item.href} asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
                {/* Display the current user's avatar and name in the footer. */}
                {user && (
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL || ''} />
                                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.displayName || user.email}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
                {/* The logout button. */}
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => logout()}>
                        <LogOut/>
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      {/* The `SidebarInset` contains the main content area to the right of the sidebar. */}
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <SidebarTrigger/> {/* The hamburger menu icon for mobile. */}
                <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
            {/* The `children` prop here is where the actual page content (e.g., the posts table) will be rendered. */}
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
