import { supabase } from "@/integrations/supabase/client";

export interface SearchEventPayload {
  pickup_location_id?: string | null;
  pickup_location_name?: string | null;
  dropoff_location_id?: string | null;
  dropoff_location_name?: string | null;
  same_location?: boolean | null;
  category_id?: string | null;
  category_name?: string | null;
  pickup_date?: string | null;
  dropoff_date?: string | null;
  pickup_time?: string | null;
  dropoff_time?: string | null;
  driver_age_id?: string | null;
  has_promo_code?: boolean | null;
  promo_code?: string | null;
}

const SESSION_KEY = "jb_search_session_id";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid =
        (crypto as any)?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
};

/**
 * Fire-and-forget logging of a "Find Your Vehicle" search submission.
 * Never throws — analytics must not break the user's flow.
 */
export const logSearchEvent = async (payload: SearchEventPayload): Promise<void> => {
  if (typeof window === "undefined") return;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const row = {
      ...payload,
      user_id: user?.id ?? null,
      session_id: getSessionId(),
      page_path: window.location.pathname + window.location.search,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    };
    const { error } = await supabase.from("search_events").insert(row);
    if (error) console.warn("logSearchEvent failed:", error.message);
  } catch (err) {
    console.warn("logSearchEvent threw:", err);
  }
};