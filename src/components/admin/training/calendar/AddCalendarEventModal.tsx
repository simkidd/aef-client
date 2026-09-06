"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Loader2, Plus } from "lucide-react";
import { Centre, Cohort } from "@/interfaces";
import { toast } from "sonner";

interface AddCalendarEventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  centres: Centre[];
  cohorts: Cohort[];
  onEventCreated?: () => void;
}

export const AddCalendarEventModal: React.FC<AddCalendarEventModalProps> = ({
  isOpen,
  onOpenChange,
  centres,
  cohorts,
  onEventCreated,
}) => {
  const [topic, setTopic] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("");
  const [selectedCentre, setSelectedCentre] = useState("");
  const [sessionType, setSessionType] = useState("Lecture");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !selectedCohort || !selectedCentre) {
      toast.error("Please fill in all required event details");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate/Trigger event creation
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Calendar session scheduled successfully");
      onOpenChange(false);
      if (onEventCreated) onEventCreated();
      // Reset form
      setTopic("");
      setSelectedCohort("");
      setSelectedCentre("");
    } catch (error) {
      toast.error("Failed to schedule calendar event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-heading text-foreground">
                  Schedule Calendar Session
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Add a training lecture, practical session, or workshop event.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="topic" className="text-xs font-medium text-foreground">
                Session Topic / Title *
              </Label>
              <Input
                id="topic"
                placeholder="e.g. Advanced Solar Inverter Wiring Workshop"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-9 text-xs bg-background border-border text-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Cohort *
                </Label>
                <Select
                  value={selectedCohort}
                  onValueChange={(val) => setSelectedCohort(val || "")}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-border text-foreground">
                    <SelectValue placeholder="Select Cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohorts.map((c) => (
                      <SelectItem
                        key={c._id || (c as any).id}
                        value={c._id || (c as any).id}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Centre / Hub *
                </Label>
                <Select
                  value={selectedCentre}
                  onValueChange={(val) => setSelectedCentre(val || "")}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-border text-foreground">
                    <SelectValue placeholder="Select Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {centres.map((c) => (
                      <SelectItem
                        key={c.id || (c as any)._id}
                        value={c.id || (c as any)._id}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Event Type
                </Label>
                <Select
                  value={sessionType}
                  onValueChange={(val) => setSessionType(val || "Lecture")}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-border text-foreground">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lecture">Lecture</SelectItem>
                    <SelectItem value="Practical">Practical Lab</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label
                  htmlFor="event-date"
                  className="text-xs font-medium text-foreground"
                >
                  Session Date
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-9 text-xs bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Start Time
                </Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-9 text-xs bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  End Time
                </Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-9 text-xs bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 border-border text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Event"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
