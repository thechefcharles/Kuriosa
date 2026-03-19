/**
 * Internal workflow safeguards for Phase 4.10.
 * This is intentionally simple: authenticated user + allowlisted email.
 */

export function parseInternalAllowlistEmails(
  raw: string | undefined
): Set<string> {
  const s = raw?.trim();
  if (!s) return new Set();
  return new Set(
    s
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function assertInternalContentWorkflowAllowed(
  userEmail: string | null | undefined
): void {
  const allowlist = parseInternalAllowlistEmails(
    process.env.INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS
  );

  // Fail closed: if allowlist is not configured, nobody can access internal tools.
  if (allowlist.size === 0) {
    throw new Error(
      "INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS is not set (Phase 4.10 internal tools are disabled)."
    );
  }

  if (!userEmail) {
    throw new Error("Missing user email for internal workflow authorization.");
  }

  const email = userEmail.toLowerCase().trim();
  if (!allowlist.has(email)) {
    throw new Error("Forbidden: user is not in INTERNAL_CONTENT_WORKFLOW_ALLOWLIST_EMAILS.");
  }
}

