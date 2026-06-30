"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, Send } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

const FAQ_ITEMS = [
  {
    q: "How do credits work?",
    a: "Credits are consumed per generation based on model, duration, and resolution. Check the credit estimator in each studio before generating.",
  },
  {
    q: "Can I use generated content commercially?",
    a: "Commercial usage depends on your plan and the model license. Pro and Studio plans include commercial rights for most models.",
  },
  {
    q: "How long are my files stored?",
    a: "Generated media is stored for 90 days on free plans and indefinitely on paid plans unless you delete them.",
  },
  {
    q: "What if a generation fails?",
    a: "Failed generations are automatically refunded. You can retry from your history page.",
  },
];

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSubject("");
    setMessage("");
    toast({ title: "Message sent", description: "We'll get back to you within 24 hours." });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">Get help with your account and generations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cyan-aurora" />
              Contact support
            </CardTitle>
            <CardDescription>Send us a message and we&apos;ll respond shortly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="border-border/60 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="border-border/60 bg-background/50 resize-none"
                />
              </div>
              <Button type="submit" disabled={sending} className="bg-aurora shadow-neon-sm">
                <Send className="mr-2 h-4 w-4" />
                Send message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-violet-electric" />
              Frequently asked questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
