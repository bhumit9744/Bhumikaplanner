const SUPABASE_URL = "https://cyasrzixhiysznsbssgm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5YXNyeml4aGl5c3puc2Jzc2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NzQyODAsImV4cCI6MjA4NjU1MDI4MH0.l351mEgutamqauI8hb1qDsaRbpecv2Pd14noR4HpZyU";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
