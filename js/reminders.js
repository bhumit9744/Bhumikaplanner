
import { supabase } from "./supabaseClient.js";

export async function addReminder(reminder) {
  return await supabase.from("reminders").insert([reminder]);
}

export async function deleteReminder(id) {
  return await supabase.from("reminders").delete().eq("id", id);
}

export async function getReminders(uid) {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_uid", uid)
    .order("remind_at", { ascending: true });

  return { data, error };
}

export function listenReminders(callback) {
  supabase
    .channel("reminders-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "reminders" }, callback)
    .subscribe();
}

