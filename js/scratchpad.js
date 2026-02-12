import { supabase } from "./supabaseClient.js";

export async function getScratchpad() {
  const { data, error } = await supabase.from("scratchpad").select("*").limit(1);
  return { data: data?.[0], error };
}

export async function updateScratchpad(id, content, uid) {
  return await supabase
    .from("scratchpad")
    .update({
      content,
      last_edited_by: uid,
      last_edited_at: new Date()
    })
    .eq("id", id);
}

export function listenScratchpad(callback) {
  supabase
    .channel("scratchpad-realtime")
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "scratchpad" }, (payload) => {
      callback(payload.new);
    })
    .subscribe();
}
