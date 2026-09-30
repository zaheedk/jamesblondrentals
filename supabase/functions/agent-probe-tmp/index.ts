const enc = new TextEncoder();
async function hmacHex(secret: string, body: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
Deno.serve(async () => {
  const k = (Deno.env.get("ZUZUCHE_RCM_API_KEY") ?? "").trim();
  const s = (Deno.env.get("ZUZUCHE_RCM_SHARED_SECRET") ?? "").trim();
  const raw = JSON.stringify({ method: "locations" });
  const sig = await hmacHex(s, raw);
  const out: Record<string, string> = { keylen: String(k.length), rawlen: String((Deno.env.get("ZUZUCHE_RCM_API_KEY") ?? "").length) };
  const urls = [
    `https://apis.rentalcarmanager.com/agent/booking/v3.2?apikey=${k}`,
    `https://apis.rentalcarmanager.com/agent/booking/v3.2?apikey=${encodeURIComponent(k)}`,
    `https://apis.rentalcarmanager.com/agent/booking/v3.2/?apikey=${k}`,
  ];
  for (const u of urls) {
    const r = await fetch(u, { method: "POST", headers: { "Content-Type": "application/json", signature: sig }, body: raw });
    out[u.replace(k, "KEY").replace(encodeURIComponent(k), "EKEY")] = r.status + " " + (await r.text()).slice(0, 120);
  }
  return new Response(JSON.stringify(out, null, 1));
});
