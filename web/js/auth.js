// auth.js - Gestión de sesiones y protección de rutas

/**
 * Verifica si el usuario está autenticado.
 * Si no lo está y la página es privada, redirige al login.
 */
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('contemporanica_user'));
    const isLoginPage = window.location.pathname.includes('login.html');
    const isPublicPage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('web/');

    if (!user && !isLoginPage && !isPublicPage) {
        // Si no hay usuario y no estamos en login o index, mandamos al login
        console.log("Acceso denegado. Redirigiendo...");
        window.location.href = 'login.html';
    }

    if (user) {
        console.log("Usuario detectado:", user.email);
        actualizarInterfaz(user);
    }
}

/**
 * Actualiza elementos de la UI según el estado del usuario
 */
function actualizarInterfaz(user) {
    const loginBtn = document.querySelector('a[href="login.html"]');
    if (loginBtn && user) {
        // Cambiamos el botón de Login por uno de Logout o Perfil
        loginBtn.outerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-xs text-slate-400 hidden md:block">${user.email}</span>
                <button onclick="logout()" class="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-salmon hover:border-salmon transition-all duration-300">
                    Logout
                </button>
            </div>
        `;
    }
}

/**
 * Simulación de Login (Para probar hoy sin Supabase)
 */
function loginSimulado(email, role) {
    const userData = { email, role, loginDate: new Date() };
    localStorage.setItem('contemporanica_user', JSON.stringify(userData));
    window.location.href = 'index.html';
}

/**
 * Cerrar sesión
 */
function logout() {
    localStorage.removeItem('contemporanica_user');
    window.location.href = 'login.html';
}

// Ejecutar el check al cargar el script
document.addEventListener('DOMContentLoaded', checkAuth);
