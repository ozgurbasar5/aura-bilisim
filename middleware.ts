import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Sadece '/epanel' ve altındaki sayfaları kontrol et
  if (request.nextUrl.pathname.startsWith('/epanel')) {
    
    // 'admin_session' çerezi var mı? (Login sayfasında oluşturduğumuz)
    const hasSession = request.cookies.has('admin_session')

    // Eğer çerez YOKSA -> Giriş sayfasına fırlat
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Sorun yoksa devam et
  return NextResponse.next()
}

// Sadece bu yollarda çalışsın (Performans için)
export const config = {
  matcher: '/epanel/:path*',
}