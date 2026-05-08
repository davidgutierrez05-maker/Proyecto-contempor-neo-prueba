import supabase from './supabase.js';

/**
 * Verifica si el usuario está autenticado y tiene los permisos necesarios.
 */
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    const path = window.location.pathname;
    console.log("🔍 Checking auth for path:", path);
    
    const isLoginPage = path.includes('login.html');
    const isPublicPage = path.includes('index.html') || path === '/' || path.endsWith('web/');
    
    if (!session && !isLoginPage && !isPublicPage) {
        console.warn("⚠️ No session found, redirecting to login...");
        window.location.href = 'login.html';
        return;
    }

    if (session) {
        console.log("✅ Session active for:", session.user.email);
        
        // Obtener el perfil con el rol
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profileError || !profile) {
            console.error("❌ Profile not found or database error:", profileError);
            if (!isPublicPage && !isLoginPage) {
                alert("Tu perfil no ha sido encontrado. Es posible que el registro fallara.");
                window.location.href = 'index.html';
            }
            // Si estamos en la home, al menos mostramos que está logueado como 'user'
            actualizarInterfaz(session.user, 'usuario sin perfil');
            return;
        }

        // Normalizamos el rol para evitar fallos por mayúsculas o espacios
        const role = profile.role ? profile.role.toLowerCase().trim() : 'user';
        console.log("👤 User role (normalized):", role);

        // Protección de rutas por rol
        const isCurrentAdmin = path.includes('admin.html');
        const isCurrentComposer = path.includes('composer.html');
        const isCurrentMusician = path.includes('musician.html');

        if (isCurrentAdmin && role !== 'admin') {
            console.warn("🚫 Access denied for admin page. Redirecting...");
            window.location.href = 'index.html';
        } else if (isCurrentComposer && role !== 'composer') {
            console.warn("🚫 Access denied for composer page. Redirecting...");
            window.location.href = 'index.html';
        } else if (isCurrentMusician && role !== 'musician') {
            console.warn("🚫 Access denied for musician page. Redirecting...");
            window.location.href = 'index.html';
        }
        
        actualizarInterfaz(session.user, role);
    }
}

/**
 * Función principal de Login real con Supabase
 */
async function intentarLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    console.log("🚀 Attempting login for:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
        console.error("❌ Login error:", error);
    } else {
        errorDiv.classList.add('hidden');
        console.log("🎉 Login successful, fetching role...");
        
        // Obtener rol para redirigir
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
        
        const role = profile?.role ? profile.role.toLowerCase().trim() : 'user';
        console.log("🎯 Redirecting to dashboard for role:", role);
        
        if (role === 'admin') window.location.href = 'admin.html';
        else if (role === 'composer') window.location.href = 'composer.html';
        else if (role === 'musician') window.location.href = 'musician.html';
        else window.location.href = 'index.html';
    }
}

function actualizarInterfaz(user, role) {
    const loginBtn = document.querySelector('a[href="login.html"]');
    if (loginBtn) {
        // Normalizamos rol para la lógica de la URL
        const normRole = role.toLowerCase().trim();
        let dashboardUrl = 'index.html';
        
        if (normRole === 'admin') dashboardUrl = 'admin.html';
        else if (normRole === 'composer') dashboardUrl = 'composer.html';
        else if (normRole === 'musician') dashboardUrl = 'musician.html';

        loginBtn.outerHTML = `
            <div class="flex items-center gap-4">
                <div class="flex flex-col items-end hidden md:flex">
                    <span class="text-[10px] font-bold text-salmon uppercase tracking-widest">${role}</span>
                    <span class="text-xs text-slate-400">${user.email}</span>
                </div>
                <a href="${dashboardUrl}" class="px-6 py-2 rounded-full bg-salmon text-white font-medium hover:brightness-110 transition-all duration-300 active:scale-95 text-sm">
                    Dashboard
                </a>
                <button id="logout-btn" class="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-rose-500/20 hover:text-rose-400 transition-all duration-300">
                    <span class="material-symbols-outlined">logout</span>
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
        console.error("Error de registro:", error);
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
