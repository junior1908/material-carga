// js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const config = window.APP_CONFIG || {};
    const supabaseClient = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

    const loginForm = document.getElementById('loginForm');
    const alertError = document.getElementById('alertError');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // 1. Se já houver sessão ativa, vai direto para o index.html
    async function checkActiveSession() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            window.location.replace('index.html');
        }
    }
    checkActiveSession();

    // 2. Submissão do login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            alertError.classList.add('d-none');
            alertError.textContent = '';

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            setLoading(true);

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    throw error;
                }

                if (data?.session) {
                    window.location.replace('index.html');
                }
            } catch (err) {
                let message = 'Falha ao autenticar. Verifique suas credenciais.';
                if (err.message.includes('Invalid login credentials')) {
                    message = 'E-mail ou senha incorretos.';
                } else if (err.message.includes('Email not confirmed')) {
                    message = 'E-mail não confirmado no Supabase.';
                }
                alertError.textContent = message;
                alertError.classList.remove('d-none');
                setLoading(false);
            }
        });
    }

    function setLoading(isLoading) {
        btnSubmit.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = 'Acessando...';
            btnSpinner.classList.remove('d-none');
        } else {
            btnText.textContent = 'Entrar';
            btnSpinner.classList.add('d-none');
        }
    }
});
