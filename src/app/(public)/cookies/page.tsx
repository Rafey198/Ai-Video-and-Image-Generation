import { LegalPage, createLegalMetadata } from "@/components/marketing/LegalPage";

export const metadata = createLegalMetadata("Cookie Policy");

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="June 1, 2026">
      <p>
        This Cookie Policy explains how VireoMorph uses cookies and similar technologies
        when you visit our website or use our application.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. They help us remember your
        preferences, keep you signed in, and understand how the platform is used.
      </p>

      <h2>2. Cookies we use</h2>
      <ul>
        <li>
          <strong>Essential:</strong> Authentication sessions, security tokens, and load
          balancing.
        </li>
        <li>
          <strong>Functional:</strong> Theme preferences and UI settings.
        </li>
        <li>
          <strong>Analytics:</strong> Aggregated usage metrics to improve performance
          (optional, where permitted).
        </li>
      </ul>

      <h2>3. Managing cookies</h2>
      <p>
        You can control cookies through your browser settings. Disabling essential cookies
        may affect sign-in and core functionality.
      </p>

      <h2>4. Third parties</h2>
      <p>
        Payment and analytics partners may set their own cookies subject to their policies.
      </p>

      <p className="text-sm text-muted-foreground">
        This is placeholder legal text. Consult qualified counsel before commercial launch.
      </p>
    </LegalPage>
  );
}
