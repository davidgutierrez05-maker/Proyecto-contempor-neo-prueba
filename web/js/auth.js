import supabase from './supabase.js';

/**
 * Verifica si el usuario está autenticado y tiene los permisos necesarios.
 */
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    const path = window.location.pathname;
    
    const isLoginPage = path.includes('login.html');
    const isPublicPage = path.includes('index.html') || path === '/' || path.endsWith('web/');
    
    if (!session && !isLoginPage && !isPublicPage) {
        window.location.href = 'login.html';
        return;
    }

    if (session) {
        // Obtener el perfil con el rol
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (path.includes('admin') && (!profile || profile.role !== 'admin')) {
            window.location.href = 'index.html';
            return;
        }
        
        actualizarInterfaz(session.user, profile?.role || 'user');
    }
}

/**
 * Función principal de Login real con Supabase
 */
async function intentarLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
        console.error("Error de login:", error.message);
    } else {
        errorDiv.classList.add('hidden');
        window.location.href = 'index.html';
    }
}

function actualizarInterfaz(user, role) {
    const loginBtn = document.querySelector('a[href="login.html"]');
    if (loginBtn) {
        loginBtn.outerHTML = `
            <div class="flex items-center gap-4">
                <div class="flex flex-col items-end hidden md:flex">
                    <span class="text-[10px] font-bold text-salmon uppercase tracking-widest">${role}</span>
                    <span class="text-xs text-slate-400">${user.email}</span>
                </div>
                <button id="logout-btn" class="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-salmon hover:border-salmon transition-all duration-300">
                    Logout
                </button>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', logout);
    }
}

async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}

/**
 * Función para registrar nuevos usuarios
 */
async function intentarRegistro() {
    const email = document.querySelector('#form-register input[type="email"]').value;
    const password = document.querySelector('#form-register input[type="password"]').value;
    const role = document.querySelector('#form-register input[name="role"]:checked').value;
    const firstName = document.querySelector('#form-register input[placeholder="John"]').value;
    const lastName = document.querySelector('#form-register input[placeholder="Doe"]').value;
    const errorDiv = document.getElementById('login-error'); // Usamos el mismo div de error

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: `${firstName} ${lastName}`,
                initial_role: role // El trigger de SQL lo convertirá en el perfil
            }
        }
    });

    if (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    } else {
        alert("Account created! Please check your email for verification (if enabled) or try logging in.");
        window.location.reload();
    }
}

// Exponer funciones al scope global
window.intentarLogin = intentarLogin;
window.intentarRegistro = intentarRegistro;
window.logout = logout;

document.addEventListener('DOMContentLoaded', checkAuth);
