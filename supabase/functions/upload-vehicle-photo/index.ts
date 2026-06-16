import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isSafePath = (path: string) =>
  path.length > 0 &&
  path.length <= 500 &&
  !path.startsWith("/") &&
  !path.includes("..") &&
  !path.includes("//") &&
  /\.jpe?g$/i.test(path);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Please sign in before uploading photos" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await authClient.auth.getUser(token);

    if (userError || !user) return json({ error: "Please sign in again before uploading photos" }, 401);

    const serviceClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data: roles, error: roleError } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "moderator"])
      .limit(1);

    if (roleError) {
      console.error("Role check failed:", roleError);
      return json({ error: "Could not verify upload permission" }, 500);
    }

    if (!roles?.length) return json({ error: "Your account is not allowed to upload vehicle photos" }, 403);

    const formData = await req.formData();
    const path = String(formData.get("path") ?? "");
    const file = formData.get("file");

    if (!isSafePath(path)) return json({ error: "Invalid photo upload path" }, 400);
    if (!(file instanceof File)) return json({ error: "Photo file is required" }, 400);
    if (file.size === 0) return json({ error: "Photo file is empty" }, 400);
    if (!file.type.startsWith("image/")) return json({ error: "Only image files can be uploaded" }, 400);

    const { error: uploadError } = await serviceClient.storage
      .from("vehicle-photos")
      .upload(path, file, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload failed:", uploadError);
      return json({ error: uploadError.message }, 500);
    }

    const { data: urlData } = serviceClient.storage.from("vehicle-photos").getPublicUrl(path);
    return json({ path, publicUrl: urlData.publicUrl });
  } catch (error) {
    console.error("Upload vehicle photo failed:", error);
    return json({ error: error instanceof Error ? error.message : "Photo upload failed" }, 500);
  }
});