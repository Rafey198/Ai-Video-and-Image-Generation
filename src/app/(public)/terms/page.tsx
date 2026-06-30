import { LegalPage, createLegalMetadata } from "@/components/marketing/LegalPage";

export const metadata = createLegalMetadata("Terms of Service");

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="June 1, 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
        VireoMorph platform and related services. By using our services, you agree to these
        Terms.
      </p>

      <h2>1. Service description</h2>
      <p>
        VireoMorph provides AI-powered tools for generating and editing images, videos, and
        audio. Features, models, and pricing may change over time with reasonable notice.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You are responsible for maintaining the security of your account credentials and for
        all activity under your account. You must provide accurate registration information.
      </p>

      <h2>3. Acceptable use</h2>
      <p>
        You may not use VireoMorph to create illegal content, infringe intellectual property,
        harass others, or circumvent safety systems. See our Acceptable Use Policy for details.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        You retain rights to your inputs. Output rights depend on applicable model licenses
        and your subscription tier. VireoMorph retains rights to the platform, branding, and
        underlying technology.
      </p>

      <h2>5. Payments & credits</h2>
      <p>
        Paid plans renew automatically unless canceled. Credits are consumed per generation
        according to published rates. Refunds are handled per our billing policy.
      </p>

      <h2>6. Disclaimers</h2>
      <p>
        Services are provided &quot;as is&quot; without warranties of uninterrupted availability
        or fitness for a particular purpose, to the extent permitted by law.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about these Terms may be sent to legal@vireomorph.dev.
      </p>

      <p className="text-sm text-muted-foreground">
        This is placeholder legal text. Consult qualified counsel before commercial launch.
      </p>
    </LegalPage>
  );
}
