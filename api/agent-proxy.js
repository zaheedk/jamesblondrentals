// Vercel Edge Function: proxies /agent/* (via vercel.json rewrite) to the Supabase agent-api edge function.
export const config = { runtime: "edge" };
const TARGET_BASE = "https://jlwvqbrtdzwrcwelyylv.supabase.co/functions/v1/agent-api/agent/";
export default async function handler(req) {
  const url = new URL(req.url);
  let sub = url.searchParams.get("__p") || url.pathname.replace(/^\/(api\/)?agent(-proxy)?\/?/, "");
  url.searchParams.delete("__p");
  if (!sub.endsWith("/")) sub += "/";
  const qs = url.searchParams.toString();
  const target = TARGET_BASE + sub + (qs ? "?" + qs : "");
  const headers = new Headers(req.headers);
  ["host", "connection", "content-length"].forEach((h) => headers.delete(h));
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const resp = await fetch(target, {
    method: req.method, headers,
    body: hasBody ? await req.arrayBuffer() : undefined, redirect: "manual",
  });
  const rh = new Headers(resp.headers);
  rh.delete("transfer-encoding"); rh.delete("content-encoding");
  return new Response(await resp.arrayBuffer(), { status: resp.status, headers: rh });
}
