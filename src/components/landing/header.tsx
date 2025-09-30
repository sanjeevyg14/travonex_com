// This component defines the main header for the website.
// It is a client component because it needs to be aware of the user's authentication status,
// which is client-side state, and it manages the state of the mobile navigation menu.

// This directive marks the component as a Client Component.
'use client';

// Import necessary components and hooks.
import { Menu, X, LayoutDashboard, LogOut, Newspaper } from 'lucide-react'; // Icons.
import Link from 'next/link'; // For client-side navigation.
import Image from 'next/image'; // For displaying images.
import { Button } from '@/components/ui/button'; // The standard button component.
import { useState } from 'react'; // React hook for state management.
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Components for the mobile menu drawer.
import { useAuth } from '@/hooks/use-auth'; // Custom hook for authentication.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Components for the user profile dropdown.
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'; // User avatar component.

// An array of navigation link objects. This makes the navigation bar easy to maintain.
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '#about', label: 'About' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#community', label: 'Community' },
];

// The main Header component.
export function Header() {
  // State to control the visibility of the mobile navigation menu (the sheet).
  const [isOpen, setIsOpen] = useState(false);
  // Get authentication state and functions from the `useAuth` hook.
  // This will cause the component to re-render when the user logs in or out.
  const { user, loading, logout, userRole } = useAuth();

  return (
    // The header is sticky, so it stays at the top of the viewport when the user scrolls.
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* The site logo, linking to the homepage. */}
        <Link href="/">
          <Image src="/travonex-logo.png" alt="Travonex" width={150} height={40} />
        </Link>
        
        {/* The desktop navigation menu. It is hidden on small screens (`hidden md:flex`). */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link key={link.label} href={link.href} className="text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
            {/* This block conditionally renders the login/profile section based on auth state. */}
            {loading ? (
                // While the auth status is loading, show a placeholder to prevent layout shift.
                <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
            ) : user ? (
                 // If a user is logged in, display the profile dropdown menu.
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 px-2 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* Conditionally render the link to the Admin Dashboard for admins and editors. */}
                        {userRole === 'admin' || userRole === 'editor' ? (
                            <DropdownMenuItem asChild>
                                <Link href="/blog/admin">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Admin Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                        ) : (
                             // Regular users get a link to their personal dashboard.
                             <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>My Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                        <Link href="/dashboard/submit">
                                <Newspaper className="mr-2 h-4 w-4" />
                                <span>Submit Story</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* The logout button triggers the logout function from the auth hook. */}
                        <DropdownMenuItem onClick={() => logout()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                // If no user is logged in, display the "Login / Sign Up" button.
                <Button asChild className="hidden md:flex">
                    <Link href="/login">Login / Sign Up</Link>
                </Button>
            )}

            {/* Mobile Navigation: This section is only visible on small screens (`md:hidden`). */}
            <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs bg-background">
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" onClick={() => setIsOpen(false)}>
                          <Image src="/travonex-logo.png" alt="Travonex" width={150} height={40} />
                        </Link>
                        <SheetClose asChild>
                        <Button variant="ghost" size="icon" aria-label="Close menu">
                            <X className="h-6 w-6" />
                        </Button>
                        </SheetClose>
                    </div>

                    <nav className="flex flex-col gap-6 text-lg font-medium">
                    {navLinks.map(link => (
                        <SheetClose asChild key={link.label}>
                        <Link href={link.href} className="text-foreground/80 hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                        </SheetClose>
                    ))}
                    </nav>

                    {/* The login button is shown at the bottom of the mobile menu if the user is logged out. */}
                    <div className="mt-auto">
                        {!user && (
                            <SheetClose asChild>
                                <Button asChild className="w-full">
                                    <Link href="/login">Login / Sign Up</Link>
                                </Button>
                            </SheetClose>
                        )}
                    </div>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
