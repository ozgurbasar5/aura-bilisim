import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cmkjewcpqohkhnfpvoqw.supabase.co"

// "eyJ" ile başlayan o uzun kod buraya gelecek:
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2pld2NwcW9oa2huZnB2b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDQ2MDIsImV4cCI6MjA4MTkyMDYwMn0.HwgnX8tn9ObFCLgStWWSSHMM7kqc9KqSZI96gpGJ6lw" 

export const supabase = createClient(supabaseUrl, supabaseKey)