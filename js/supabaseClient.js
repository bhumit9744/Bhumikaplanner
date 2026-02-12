import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ntgeboccnkksabgsacku.supabase.coL";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Z2Vib2Njbmtrc2FiZ3NhY2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTQzNTAsImV4cCI6MjA4NjQ3MDM1MH0.AfqGTuILK5Cx3FJk_TRKxmOHWF-aKDgL3kcxVykKnHc";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
