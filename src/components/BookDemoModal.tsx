import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // use local zod

// Local client-only schema (avoid drizzle-zod in browser)
const demoRequestFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Event type is required"),
  message: z.string().optional(),
});

type DemoFormData = z.infer<typeof demoRequestFormSchema>;

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const { toast } = useToast();
  const hasAccessKey = Boolean(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);
  
  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoRequestFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      message: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const submitDemoRequest = useMutation({
    mutationFn: async (data: DemoFormData) => {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) {
        throw new Error("Missing Web3Forms access key. Configure VITE_WEB3FORMS_ACCESS_KEY.");
      }

      const formData = new FormData();
      formData.append("access_key", accessKey);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", (data.phone && data.phone.trim()) || "Not provided");
      formData.append("event_type", data.eventType);
      formData.append("message", (data.message && data.message.trim()) || "No message provided");
      formData.append("subject", `New Demo Request from ${data.name}`);
      formData.append("from_name", "ARI Website");
      formData.append("reply_to", data.email);
      formData.append("redirect", "false");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const json = await response.json().catch(() => ({ success: false, message: "Invalid JSON response" }));

      if (!response.ok || !json?.success) {
        throw new Error(json?.message || `Submission failed (${response.status})`);
      }

      return json;
    },
    onSuccess: (json) => {
      toast({
        title: "Demo Booked Successfully!",
        description: json?.message || "We'll get in touch with you within 24 hours.",
      });
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      console.error("Web3Forms error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit demo request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: DemoFormData) => {
    const normalizedData: DemoFormData = {
      ...data,
      phone: data.phone?.trim() || undefined,
      message: data.message?.trim() || undefined,
    };
    submitDemoRequest.mutate(normalizedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" data-testid="modal-book-demo">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book a Demo</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll reach out to schedule your personalized ARI demo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} data-testid="input-name" />
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
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      {...field}
                      value={field.value || ""}
                      data-testid="input-phone" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-event-type">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="birthday">Birthday Party</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your event..."
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      data-testid="input-message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!hasAccessKey && (
              <p className="text-xs text-amber-600">Missing Web3Forms access key. Submissions will fail until VITE_WEB3FORMS_ACCESS_KEY is set.</p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                data-testid="button-cancel"
                disabled={submitDemoRequest.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                data-testid="button-submit"
                disabled={submitDemoRequest.isPending}
              >
                {submitDemoRequest.isPending ? "Submitting..." : "Book Demo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
