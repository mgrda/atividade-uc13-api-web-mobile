import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // Rotas públicas que não requerem autenticação
    // Inclui assets estáticos e rotas de autenticação
    const publicRoutes = [
        '/',
        '/login',
        '/cadastro',
        '/recuperar-senha',
        '/sobre',
        '/servicos',
        '/favicon.ico'
    ]

    // Verifica se é uma rota pública
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    )

    // Verifica se é um arquivo estático (imagens, etc) que escapou do matcher
    const isStaticAsset = pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/)

    // 1. Proteção de rotas: Se não tiver token e tentar acessar rota protegida
    if (!token && !isPublicRoute && !isStaticAsset) {
        const loginUrl = new URL('/login', request.url)
        // Redireciona para login
        return NextResponse.redirect(loginUrl)
    }

    // 2. Redirecionamento de usuários logados: Se tiver token e tentar acessar login/cadastro
    if (token && (pathname === '/login' || pathname === '/cadastro')) {
        // Tenta decodificar o token para saber o perfil (opcional/avançado)
        // Por enquanto, redirecionamos para o dashboard padrão de paciente
        // TODO: Implementar decodificação do JWT para redirecionar para o dashboard correto (médico/admin/atendente)
        return NextResponse.redirect(new URL('/app/paciente/dashboard', request.url))
    }

    // 3. Controle de Acesso por Perfil (Role Based Access Control)
    // Aqui você pode expandir para verificar se o usuário tem a role correta para /admin, /app/medico, etc.
    if (token) {
        try {
            // Exemplo simples de decodificação se o token for JWT padrão
            // const payload = JSON.parse(atob(token.split('.')[1]))
            // const role = payload.role

            // if (pathname.startsWith('/admin') && role !== 'ADMIN') {
            //   return NextResponse.redirect(new URL('/app/paciente/dashboard', request.url))
            // }
        } catch (e) {
            // Token inválido?
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         */
        '/((?!api|_next/static|_next/image).*)',
    ],
}
