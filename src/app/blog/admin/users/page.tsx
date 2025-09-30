// This file creates the page for managing users in the admin dashboard.
// This page is restricted to users with the 'admin' role.

// This is a Client Component because it displays data from the mock store
// which could theoretically be updated by other admin actions.
'use client';

// Import React hooks.
import { useState, useEffect } from 'react';
// Import UI components.
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
// Import icons.
import { PlusCircle, MoreHorizontal } from "lucide-react";
// Import Firestore functions.
import { getUsers } from '@/lib/firestore';
import { User } from '@/lib/types';
// Import date formatting utility.
import { format } from "date-fns";

// The main component for the Admin Users page.
export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const users = await getUsers();
            setUsers(users);
        }
        fetchUsers();
    }, []);

  // The functionality for adding/editing/deleting users is not implemented in this mock version,
  // but the UI structure is here to demonstrate what it would look like.

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all registered users and their roles.</CardDescription>
        </div>
        {/* The "Add User" button is present but not wired up. */}
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map over the mockUsers array to render a row for each user. */}
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    {/* Display a different badge style based on the user's role. */}
                    <Badge variant={user.role === 'admin' ? 'default' : user.role === 'editor' ? 'secondary' : 'outline'}>
                        {user.role}
                    </Badge>
                </TableCell>
                 <TableCell>{format(new Date(user.created_at), 'yyyy-MM-dd')}</TableCell>
                <TableCell className="text-right">
                    {/* The action menu for each user. */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* These actions are placeholders in the mock-up. */}
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
