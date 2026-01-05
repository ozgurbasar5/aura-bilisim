import { createClient } from '@supabase/supabase-js'

// Proje URL'in (Doğru görünüyor)
const supabaseUrl = "https://cmkjewcpqohkhnfpvoqw.supabase.co"

// API Anahtarın
// DİKKAT: Genelde Supabase 'anon' key'leri "eyJ..." ile başlar (uzun bir şifre gibidir).
// Eğer bu kısa key çalışmazsa, Supabase panelinden (Settings > API > Project API keys > anon public) 
// olan o uzun "eyJ..." ile başlayan anahtarı kopyalayıp buraya yapıştır.
const supabaseKey = "sb_publishable_TleDLCVmAFGL0-cRSkLmTw_tKgRsKwA"

export const supabase = createClient(supabaseUrl, supabaseKey)