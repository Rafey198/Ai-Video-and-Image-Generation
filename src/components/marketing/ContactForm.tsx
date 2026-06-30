"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useToast } from "@/components/ui/toast";

interface ContactFormProps {
  variant?: "contact" | "enterprise";
}

export function ContactForm({ variant = "contact" }: ContactFormProps) {
  const reducedMotion = useReducedMotion();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    toast({
      title: "Message sent",
      description: "We'll get back to you within one business day.",
    });
    (e.target as HTMLFormElement).reset();
  }

  return (
    <motion.form
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border/50 bg-card/40 p-6 shadow-glass backdrop-blur-sm sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Jane Creator" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
          />
        </div>
      </div>

      {variant === "enterprise" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required placeholder="Acme Studios" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-size">Team size</Label>
            <Select name="team-size">
              <SelectTrigger id="team-size">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1–10</SelectItem>
                <SelectItem value="11-50">11–50</SelectItem>
                <SelectItem value="51-200">51–200</SelectItem>
                <SelectItem value="200+">200+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {variant === "contact" && (
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required placeholder="How can we help?" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={
            variant === "enterprise"
              ? "Tell us about your use case, volume, and timeline..."
              : "Share your question or feedback..."
          }
        />
      </div>

      <Button type="submit" variant="gradient" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending..." : "Send message"}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </motion.form>
  );
}
