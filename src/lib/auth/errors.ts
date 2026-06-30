/** Human-readable NextAuth error codes (see next-auth/errors). */
export function getAuthErrorMessage(error: string | null | undefined): string | null {
  if (!error) return null;

  const messages: Record<string, string> = {
    Configuration:
      "Server auth is misconfigured. Set NEXTAUTH_SECRET and NEXTAUTH_URL on Vercel, then redeploy.",
    AccessDenied: "Access denied. Your account may be suspended or not on the Google test-user list.",
    Verification: "The sign-in link expired or is invalid.",
    OAuthSignin: "Could not start Google sign-in. Check AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET on Vercel.",
    OAuthCallback:
      "Google callback failed. Add your Vercel URL to Google Console redirect URIs and redeploy.",
    OAuthCreateAccount: "Could not create your account. Run prisma db push and db:seed on production.",
    EmailCreateAccount: "Could not create your account. Please try again.",
    Callback: "Sign-in failed after redirect. Check DATABASE_URL, NEXTAUTH_URL, and redeploy.",
    OAuthAccountNotLinked:
      "This email already has a password account. Sign in with email and password instead.",
    CredentialsSignin: "Invalid email or password.",
    SessionRequired: "Please sign in to continue.",
    Default: "Authentication failed. Check Vercel environment variables and try again.",
  };

  return messages[error] ?? messages.Default;
}
