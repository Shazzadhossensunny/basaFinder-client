// components/listings/RentalRequestModal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createRequest } from "@/services/RequestService";
import { useUser } from "@/context/UserContext";

// ✅ Zod Schema for Form Validation
const rentalRequestSchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters long."),
});

interface RentalRequestModalProps {
  listingId: string;
}

const RentalRequestModal: React.FC<RentalRequestModalProps> = ({
  listingId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser(); // Get logged-in user data
  const tenantId = user?.userId; // Ensure tenantId is dynamically retrieved

  const form = useForm({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = async (data: { message: string }) => {
    if (!tenantId) {
      toast.error("You need to be logged in to submit a request.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { listingId, tenantId, message: data.message };
      console.log("payload", payload);
      const response = await createRequest(payload);

      if (response.success) {
        toast.success("Request Submitted", {
          description: "Your rental request has been sent.",
        });
        setIsOpen(false);
        form.reset();
      } else {
        toast.error("Submission Failed", {
          description: response.message || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Request Rental</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request to Rent</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Message Input */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to Landlord</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Introduce yourself and why you're interested in this property"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RentalRequestModal;
