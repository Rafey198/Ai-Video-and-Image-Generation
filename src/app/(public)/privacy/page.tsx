import { LegalPage, createLegalMetadata } from "@/components/marketing/LegalPage";

export const metadata = createLegalMetadata("Privacy Policy");

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="June 1, 2026">
      <p>
        VireoMorph (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy
        describes how we collect, use, and protect personal data when you use our platform.
      </p>

      <h2>1. Data we collect</h2>
      <p>
        We collect account information (name, email), usage data (generations, credits),
        payment details (processed by our payment provider), and technical logs (IP address,
        device type) for security and analytics.
      </p>

      <h2>2. How we use data</h2>
      <p>
        Data is used to provide the service, process payments, improve models and safety
        systems, communicate with you, and comply with legal obligations.
      </p>

      <h2>3. Content & generations</h2>
      <p>
        Prompts and uploads are stored to deliver generations and enable your gallery.
        Private content is not used for public training without explicit consent.
      </p>

      <h2>4. Sharing</h2>
      <p>
        We share data with infrastructure providers, model API partners (as needed to
        fulfill generations), and payment processors under data processing agreements.
      </p>

      <h2>5. Your rights</h2>
      <p>
        Depending on your jurisdiction, you may request access, correction, deletion, or
        portability of your personal data. Contact privacy@vireomorph.dev.
      </p>

      <h2>6. Retention</h2>
      <p>
        We retain account data while your account is active and for a reasonable period
        thereafter for legal and operational purposes.
      </p>

      <p className="text-sm text-muted-foreground">
        This is placeholder legal text. Consult qualified counsel before commercial launch.
      </p>
    </LegalPage>
  );
}
