import { supabase } from "./supabaseClient.js";

export async function addMission(mission) {
  return await supabase.from("missions").insert([mission]);
}

export async function deleteMission(id) {
  return await supabase.from("missions").delete().eq("id", id);
}

export async function getMissions() {
  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .order("deadline", { ascending: true });

  return { data, error };
}

export function listenMissions(callback) {
  supabase
    .channel("missions-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "missions" }, callback)
    .subscribe();
}
