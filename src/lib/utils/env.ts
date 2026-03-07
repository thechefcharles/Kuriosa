const required = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
} as const;

export type EnvKeys = keyof typeof required;

export function validateEnv(): Record<EnvKeys, string> {
  const missing: string[] = [];

  for (const [key, value] of Object.entries(required)) {
    if (!value || value === "your_supabase_url_here" || value === "your_supabase_anon_key_here" || value === "your_openai_api_key_here") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing or invalid env: ${missing.join(", ")}. See ENVIRONMENT_SETUP.md`);
  }

  return required as Record<EnvKeys, string>;
}
