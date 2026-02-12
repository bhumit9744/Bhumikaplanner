import { supabase } from "./supabaseClient.js";

export async function updatePresence(uid) {
  await supabase.from("presence").insert([{ uid, last_active: new Date() }]);
}

export async function getPresence() {
  const { data } = await supabase
    .from("presence")
    .select("*")
    .order("last_active", { ascending: false })
    .limit(10);

  return data || [];
}
