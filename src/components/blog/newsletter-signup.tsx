// This component provides a newsletter signup form.
// It uses `react-hook-form` and `zod` for validation and state management.

// This is a Client Component because it handles form state and user interactions.
'use client';

// Import the resolver for integrating Zod with react-hook-form.
import { zodResolver } from "@hookform/resolvers/zod";
// Import the main hook from react-hook-form.
import { useForm } from "react-hook-form";
// Import Zod for schema validation.
import * as z from "zod";
// Import UI components.
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Import the custom hook for showing toast notifications.
import { useToast } from "@/hooks/use-toast";
import { addNewsletterSubscriber } from "@/lib/firestore";

// Define the validation schema for the form. It ensures the 'email' field is a valid email address.
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

// The main component for the Newsletter Signup form.
export function NewsletterSignup() {
  // Get the `toast` function from our custom hook to provide feedback to the user.
  const { toast } = useToast();

  // Initialize react-hook-form with our Zod schema.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // This function is called when the form is submitted and passes validation.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await addNewsletterSubscriber({ ...values, created_at: new Date() });
        // Show a success message to the user.
        toast({
          title: "Subscribed! 🎉",
          description: "Thanks for joining our newsletter. Look out for amazing travel stories in your inbox!",
        });
        // Reset the form fields to their default values.
        form.reset();
    } catch (error) {
        toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive"
        })
    }
  }

  // The JSX for the form.
  return (
    <div className="max-w-2xl mx-auto text-center bg-secondary p-10 md:p-16 rounded-2xl shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold font-headline">
        Join Our Newsletter
      </h2>
      <p className="mt-4 text-lg max-w-2xl mx-auto text-foreground/80">
        Get the latest travel stories, tips, and deals delivered straight to your inbox.
      </p>
      <div className="mt-8">
        {/* The `Form` component from react-hook-form provides context to all child fields. */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-center gap-4 max-w-md mx-auto">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      {...field} // This spreads `onChange`, `onBlur`, `value`, etc., into the Input.
                      className="rounded-2xl p-6 text-base text-center sm:text-left" 
                    />
                  </FormControl>
                  {/* `FormMessage` will automatically display validation errors for this field. */}
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="rounded-2xl px-8 py-6 font-bold w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
