import { supabase } from "../src/integrations/supabase/client";

async function main() {
  // Query all profiles with role 'pending' from auth somehow... wait, we can't query auth.users from client
  // But we can query profiles
  const { data: profiles, error: pErr } = await supabase.from("profiles").select("*");
  console.log("Profiles:", profiles?.length);

  const { data: requests, error: rErr } = await supabase.from("institution_requests").select("*");
  console.log("Institution requests:", requests);
  if (rErr) console.error("Error:", rErr);
}

main();
