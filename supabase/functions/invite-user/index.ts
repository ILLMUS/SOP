import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) throw new Error("Unauthorized");

    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Caller's active organization
    const { data: callerProfile } = await admin
      .from("profiles").select("org_id").eq("id", caller.id).maybeSingle();
    const orgId = callerProfile?.org_id;
    if (!orgId) throw new Error("You do not belong to an organization");

    const { data: adminRole } = await admin
      .from("user_roles").select("role")
      .eq("user_id", caller.id).eq("org_id", orgId)
      .in("role", ["super_admin", "owner_director"]).maybeSingle();
    if (!adminRole) throw new Error("Forbidden: organization admins only");

    const { email, password, full_name, role } = await req.json();
    if (!email || !password) throw new Error("Email and password are required");

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || email },
    });
    if (createErr) throw createErr;
    const newUserId = created.user!.id;

    await admin.from("profiles")
      .update({ org_id: orgId, full_name: full_name || email })
      .eq("id", newUserId);

    await admin.from("organization_members")
      .upsert({ org_id: orgId, user_id: newUserId }, { onConflict: "org_id,user_id" });

    if (role) {
      await admin.from("user_roles")
        .insert({ user_id: newUserId, org_id: orgId, role });
    }

    return new Response(JSON.stringify({ success: true, user_id: newUserId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});