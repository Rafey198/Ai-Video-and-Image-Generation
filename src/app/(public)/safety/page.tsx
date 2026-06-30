import Link from "next/link";
import { LegalPage, createLegalMetadata } from "@/components/marketing/LegalPage";

export const metadata = createLegalMetadata("Safety Policy");

export default function SafetyPage() {
  return (
    <LegalPage title="Safety Policy" lastUpdated="June 1, 2026">
      <p>
        VireoMorph is committed to responsible AI creation. This policy outlines our
        approach to content safety, moderation, and user protections.
      </p>

      <h2>1. Prohibited content</h2>
      <p>
        We prohibit generations that depict illegal activity, non-consensual intimate imagery,
        extreme violence, hate speech, or content that exploits minors. Automated and human
        review systems enforce these rules.
      </p>

      <h2>2. Moderation pipeline</h2>
      <p>
        Prompts and outputs pass through classifiers, blocklists, and category-specific
        rules before delivery. Flagged content may be blocked or queued for review.
      </p>

      <h2>3. User controls</h2>
      <p>
        Workspace admins can configure additional safety rules, visibility defaults, and
        approval workflows for team-generated content.
      </p>

      <h2>4. Reporting</h2>
      <p>
        To report policy violations or unsafe outputs, contact safety@vireomorph.dev with
        relevant job IDs and timestamps.
      </p>

      <h2>5. Appeals</h2>
      <p>
        If you believe content was incorrectly moderated, you may request a review. Enterprise
        customers have access to priority appeals through their account manager.
      </p>

      <h2>6. Related policies</h2>
      <p>
        See also our{" "}
        <Link href="/terms" className="text-violet-electric hover:underline">
          Terms of Service
        </Link>
        ,{" "}
        <Link href="/privacy" className="text-violet-electric hover:underline">
          Privacy Policy
        </Link>
        , and Acceptable Use guidelines.
      </p>

      <p className="text-sm text-muted-foreground">
        This is placeholder legal text. Consult qualified counsel before commercial launch.
      </p>
    </LegalPage>
  );
}
