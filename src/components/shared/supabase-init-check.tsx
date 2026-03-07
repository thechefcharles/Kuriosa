"use client";

import { useEffect } from "react";

export function SupabaseInitCheck() {
  useEffect(() => {
    import("@/lib/supabase/supabase-browser-client")
      .then(({ supabaseBrowser }) => {
        if (supabaseBrowser) console.log("[Kuriosa] Supabase browser client initialized");
      })
      .catch((e) => console.warn("[Kuriosa] Supabase client:", e));
  }, []);

  return null;
}
