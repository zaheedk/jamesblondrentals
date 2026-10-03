// Vercel Edge Function: proxies /agent/* to the Supabase agent-api edge function.
// Needed because vercel.json external rewrites are not honoured on this project
// (Vite preset serves the SPA fallback instead), so the proxy lives in code.
export const config = { runtime: "edge" };

const TARGET_BASE =
  "https://jlwvqbrtdzwrcwelyylv.supabase.co/functions/v1/agent-api/agent/";

export default async function handler(req) {
  const url = new URL(req.url);
  const subPath = url.pathname.replace(/^\/agent\/?/, "");
  const target = TARGET_BASE + subPath + url.search;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const resp = await fetch(target, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    redirect: "manual",
  });

  const respHeaders = new Headers(resp.headers);
  respHeaders.delete("transfer-encoding");
  return new Response(resp.body, { status: resp.status, headers: respHeaders });
}
