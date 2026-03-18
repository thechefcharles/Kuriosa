/**
 * Session-only hints for how the user opened a curiosity (daily / random / browse).
 * Used when recording completion in user_topic_history.was_daily_feature / was_random_spin.
 */

const KEY = "kuriosa_topic_discovery_v1";

export type TopicDiscoverySession = {
  slug: string;
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
};

export function setTopicDiscoveryContext(
  slug: string,
  ctx: { wasDailyFeature: boolean; wasRandomSpin: boolean }
): void {
  if (typeof window === "undefined") return;
  const s = slug.trim();
  if (!s) return;
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        slug: s,
        wasDailyFeature: ctx.wasDailyFeature,
        wasRandomSpin: ctx.wasRandomSpin,
      })
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function getTopicDiscoveryContext(slug: string): {
  wasDailyFeature: boolean;
  wasRandomSpin: boolean;
} {
  if (typeof window === "undefined") {
    return { wasDailyFeature: false, wasRandomSpin: false };
  }
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { wasDailyFeature: false, wasRandomSpin: false };
    const p = JSON.parse(raw) as TopicDiscoverySession;
    if (p.slug !== slug.trim()) {
      return { wasDailyFeature: false, wasRandomSpin: false };
    }
    return {
      wasDailyFeature: Boolean(p.wasDailyFeature),
      wasRandomSpin: Boolean(p.wasRandomSpin),
    };
  } catch {
    return { wasDailyFeature: false, wasRandomSpin: false };
  }
}
