import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
 "https://bjchdqmaciseniqgurnd.supabase.co",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqY2hkcW1hY2lzZW5pcWd1cm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzgzMjIsImV4cCI6MjA4Njk1NDMyMn0.slcHbFP9toepE2N_hMkWsYphLXLVajrFQfP_il2iTaw"
)