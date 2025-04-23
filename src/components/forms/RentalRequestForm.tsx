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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createRequest } from "@/services/RequestService";
import { useUser } from "@/context/UserContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const rentalRequestSchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters long."),
  moveInDate: z
    .date({
      required_error: "Move-in date is required",
    })
    .min(new Date(), "Move-in date must be in the future"),
  rentalDuration: z
    .number()
    .int()
    .min(1, "Rental duration must be at least 1 month"),
  specialRequirements: z.string().optional(),
  agreedToTerms: z.literal<boolean>(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

interface RentalRequestModalProps {
  listingId: string;
  listingDetails?: {
    location?: string;
  };
}

const RentalRequestModal: React.FC<RentalRequestModalProps> = ({
  listingId,
  listingDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const tenantId = user?.userId;

  const form = useForm<z.infer<typeof rentalRequestSchema>>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: {
      message: "",
      moveInDate: undefined,
      rentalDuration: 12,
      specialRequirements: "",
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof rentalRequestSchema>) => {
    if (!tenantId) {
      toast.error("You need to be logged in to submit a request.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        listingId,
        tenantId,
        ...data,
        moveInDate: data.moveInDate.toISOString(),
      };

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
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
          Request Rental
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request to Rent</DialogTitle>
          {listingDetails?.location && (
            <p className="text-sm text-muted-foreground">
              {listingDetails.location}
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to Landlord</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Introduce yourself and explain why you're interested in this property"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Move-in Date Field */}
            <FormField
              control={form.control}
              name="moveInDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Desired Move-in Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rental Duration Field */}
            <FormField
              control={form.control}
              name="rentalDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rental Duration (months)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Special Requirements Field */}
            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or questions"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms Agreement Field */}
            <FormField
              control={form.control}
              name="agreedToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I agree to the terms and conditions</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RentalRequestModal;
