// assets/js/layout.js
document.addEventListener('DOMContentLoaded', async () => {
    const config = window.APP_CONFIG || {};
    const supabaseClient = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

    // 1. Verificação de Autenticação / Token
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError || !session) {
        window.location.replace('auth.html');
        return;
    }

    const user = session.user;

    // 2. Consulta do Perfil do Usuário (RBAC)
    let userProfile = null;
    try {
        const { data, error } = await supabaseClient
            .from('perfis_usuarios')
            .select('nome_de_guerra, posto_graduacao, perfil')
            .eq('id', user.id)
            .single();

        if (error || !data) {
            userProfile = { perfil: 'tecnico', nome_de_guerra: user.email.split('@')[0] };
        } else {
            userProfile = data;
        }
    } catch (e) {
        userProfile = { perfil: 'tecnico', nome_de_guerra: user.email.split('@')[0] };
    }

    // Exibe identificação no Dropdown do Cabeçalho
    const labelUser = document.getElementById('navbarUserName');
    if (labelUser) {
        const posto = userProfile.posto_graduacao ? `${userProfile.posto_graduacao} ` : '';
        const nome = userProfile.nome_de_guerra || user.email;
        labelUser.textContent = `${posto}${nome} (${userProfile.perfil.toUpperCase()})`;
    }

    // 3. Matriz de Rotas RBAC
    const menuRoutes = [
        { label: 'Início / Painel', url: 'index.html', icon: '📊', roles: ['admin', 'chefe', 'tecnico'] },
        { label: 'Conferência Operacional', url: 'conferencia.html', icon: '📦', roles: ['admin', 'chefe', 'tecnico'] },
        { label: 'Extratos e Auditoria', url: 'extratos.html', icon: '📈', roles: ['admin', 'chefe', 'tecnico'] },
        { label: 'Relatórios & Correlação', url: 'relatorios.html', icon: '📑', roles: ['admin', 'chefe', 'tecnico'] },
        { label: 'Gerenciar Conferências', url: 'conferencias.html', icon: '📋', roles: ['admin', 'chefe'] },
        { label: 'Importar Arquivo CSV', url: 'carga_csv.html', icon: '📁', roles: ['admin', 'chefe'] },
        { label: 'Gestão de Usuários', url: 'usuarios.html', icon: '👥', roles: ['admin'] }
    ];

    // 4. Renderização dos Itens do Menu Lateral
    const sidebarNav = document.getElementById('sidebarNav');
    if (sidebarNav) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        sidebarNav.innerHTML = '';

        menuRoutes
            .filter(item => item.roles.includes(userProfile.perfil))
            .forEach(item => {
                const isActive = currentPage === item.url ? 'active' : '';
                const a = document.createElement('a');
                a.href = item.url;
                a.className = `nav-link-custom ${isActive}`;
                a.title = item.label;
                a.innerHTML = `
                    <span class="sidebar-icon">${item.icon}</span> 
                    <span class="sidebar-label">${item.label}</span>
                `;
                sidebarNav.appendChild(a);
            });
    }

    // 5. Botão de Logout Global (Dropdown)
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
            window.location.replace('auth.html');
        });
    }

    // 6. Controle de Alternância da Barra Lateral (Desktop vs Mobile)
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isDesktop = window.innerWidth >= 992;
            
            if (isDesktop) {
                // Em tela grande: alterna entre normal (260px) e estreito (70px)
                document.body.classList.toggle('narrow-desktop');
                document.body.classList.remove('hide-mobile');
            } else {
                // Em tela pequena: alterna entre estreito (70px) e oculto (0px)
                document.body.classList.toggle('hide-mobile');
                document.body.classList.remove('narrow-desktop');
            }
        });
    }

    // Limpa classes inconsistentes se o usuário redimensionar a janela do navegador
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            document.body.classList.remove('hide-mobile');
        } else {
            document.body.classList.remove('narrow-desktop');
        }
    });
});