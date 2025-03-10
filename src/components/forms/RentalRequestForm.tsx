"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRequest } from "@/services/RequestService";
import { toast } from "sonner";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface RentalRequestFormProps {
  listingId: string;
}

const RentalRequestForm: React.FC<RentalRequestFormProps> = ({ listingId }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moveInDate, setMoveInDate] = useState<Date | null>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 1 week from now
  );
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!moveInDate) {
      toast.error("Please select a move-in date");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("listingId", listingId);
      formData.append("moveInDate", moveInDate.toISOString());
      if (note) formData.append("note", note);

      const response = await createRequest(formData);

      if (response.success) {
        toast.success("Rental request submitted successfully!");
        router.push("/dashboard/requests");
      } else {
        toast.error(response.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Request This Property</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
            <div className="border rounded-md">
              <ReactDatePicker
                id="moveInDate"
                selected={moveInDate}
                onChange={(date) => setMoveInDate(date)}
                minDate={new Date()}
                className="w-full p-2 rounded-md focus:outline-none"
                dateFormat="MMMM d, yyyy"
                placeholderText="Select a date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Additional Notes (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Share any special requirements or questions you have..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !moveInDate}
          >
            {isSubmitting ? "Submitting..." : "Submit Rental Request"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="border-t text-sm text-gray-500 pt-4 pb-4 flex justify-center">
        The landlord will be notified of your request
      </CardFooter>
    </Card>
  );
};

export default RentalRequestForm;
