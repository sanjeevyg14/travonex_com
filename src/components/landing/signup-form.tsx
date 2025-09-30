// This component is the signup form for early access, featured on the homepage.
// It collects user details and simulates a redirect to a WhatsApp community.

// This is a Client Component as it handles form state and user interactions.
"use client"

// Import libraries for form validation and state management.
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
// Import UI components from ShadCN.
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// Import the custom hook for showing toast notifications.
import { useToast } from "@/hooks/use-toast"
import { addEarlyAccessUser } from "@/lib/firestore"

// Define the validation schema for the form using Zod.
// This ensures all fields are filled correctly before submission.
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  whatsappNumber: z.string().min(10, {
    message: "Please enter a valid mobile number.",
  }),
  userType: z.enum(["traveller", "organizer"], { // Ensures the value is one of these two strings.
    required_error: "You need to select a user type.",
  }),
})

// The main component for the SignupForm.
export function SignupForm() {
  // Get the `toast` function for user feedback.
  const { toast } = useToast()

  // Initialize react-hook-form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use the Zod schema for validation.
    defaultValues: {
      name: "",
      email: "",
      whatsappNumber: "",
    },
  })

  // This function handles the form submission.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await addEarlyAccessUser({ ...values, created_at: new Date() });
        // Show a success toast to the user.
        toast({
          title: "Welcome to the tribe! 🎉",
          description: "Redirecting you to our WhatsApp community...",
        })
        
        // This is a placeholder link. It should be replaced with the actual WhatsApp community invite link.
        const whatsappCommunityLink = "https://chat.whatsapp.com/IGMcYhUUjJBF2MYOGLvrOp";

        // Redirect the user to the WhatsApp link after a short delay so they can read the toast message.
        setTimeout(() => {
          window.location.href = whatsappCommunityLink;
        }, 2000);
    } catch (error) {
        toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive"
        })
    }
  }

  // The JSX for the form layout.
  return (
    <Card className="max-w-lg mx-auto shadow-xl rounded-2xl border-none">
        <CardHeader className="text-center p-8">
            <CardTitle className="font-headline text-3xl md:text-4xl">Be the First to Experience Travonex</CardTitle>
            <CardDescription className="pt-2">Sign up for early access, exclusive discounts, and curated travel hacks.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    {/* `sr-only` is a Tailwind class to hide the label visually but keep it for screen readers. */}
                    <FormLabel className="sr-only">Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Your Name" {...field} className="rounded-2xl p-6" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} className="rounded-2xl p-6"/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="sr-only">WhatsApp Mobile No.</FormLabel>
                    <FormControl>
                        <Input type="tel" placeholder="WhatsApp Mobile No." {...field} className="rounded-2xl p-6"/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>I am a...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="traveller" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Traveller
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="organizer" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Organizer
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full rounded-2xl p-6 font-bold" size="lg">Sign Up & Join the Tribe</Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}
