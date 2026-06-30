import { ContactForm } from "@/components/marketing/ContactForm";
import { PageHero } from "@/components/marketing/PageHero";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact — ${SITE_CONFIG.name}`,
  description: "Get in touch with the VireoMorph team for support, sales, or partnerships.",
};

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@vireomorph.dev",
    description: "General inquiries and support",
  },
  {
    icon: MessageSquare,
    title: "Sales",
    detail: "sales@vireomorph.dev",
    description: "Enterprise and team plans",
  },
  {
    icon: MapPin,
    title: "HQ",
    detail: "San Francisco, CA",
    description: "Remote-first team worldwide",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        badge="Contact"
        title="Get in touch"
        subtitle="Questions about plans, partnerships, or technical setup—we're here to help."
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="space-y-8 lg:col-span-2">
            {CONTACT_CHANNELS.map((channel) => (
              <div key={channel.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-glow/10">
                  <channel.icon className="h-5 w-5 text-violet-electric" />
                </div>
                <div>
                  <h3 className="font-semibold">{channel.title}</h3>
                  <p className="text-violet-electric">{channel.detail}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <ContactForm variant="contact" />
          </div>
        </div>
      </section>
    </>
  );
}
