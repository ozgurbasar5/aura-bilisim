import { createClient } from '@supabase/supabase-js'

// Gizli kasayı boşver, adresi direkt buraya yazdık
const supabaseUrl = "https://cmkjewcpqohkhnfpvoqw.supabase.co"

// Senin verdiğin anahtar (Eğer çalışmazsa Supabase'den 'anon' key'i tekrar kontrol ederiz)
const supabaseKey = "sb_publishable_TleDLCVmAFGL0-cRSkLmTw_tKgRsKwA"

export const supabase = createClient(supabaseUrl, supabaseKey)