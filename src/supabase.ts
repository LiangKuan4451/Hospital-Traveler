import { createClient } from '@supabase/functions-js'

const supabaseUrl = 'https://noetltrdlclpgcnrxsmn.supabase.co'
const supabaseAnonKey
  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZXRsdHJkbGNscGdjbnJ4c21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzk0ODQsImV4cCI6MjA1OTc1NTQ4NH0.sjJ2_6BG7wTZH73OLDUwZ8TAuQVx5_2B6IOm-J0YedM'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
