import { createClient } from '@supabase/supabase-js'

// Supabase URL'in doğru görünüyor
const supabaseUrl = "https://cmkjewcpqohkhnfpvoqw.supabase.co"

// BURAYI DÜZELT: "sb_publishable..." yerine "eyJ..." ile başlayan keyi yapıştır.
const supabaseKey = "sb_publishable_TleDLCVmAFGL0-cRSkLmTw_tKgRsKwA"

export const supabase = createClient(supabaseUrl, supabaseKey)