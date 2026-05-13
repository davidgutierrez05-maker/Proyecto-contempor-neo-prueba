import supabase from './supabase.js';

let currentUser = null;

async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = session.user;
    
    await loadUserProfile();
    await loadStats();
    await loadValidations();
    await loadMyWorks();

    // Show default section
    const hash = window.location.hash.substring(1) || 'overview';
    showSection(hash);
}

async function loadUserProfile() {
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
    
    if (profile) {
        document.getElementById('user-name').textContent = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Composer';
        if (profile.avatar_url) {
            document.getElementById('user-avatar').src = profile.avatar_url;
        }
    }
}

async function loadStats() {
    const { count: worksCount } = await supabase
        .from('works')
        .select('*', { count: 'exact', head: true })
        .eq('composer_id', currentUser.id)
        .eq('status', 'validated');

    const { count: pendingCount } = await supabase
        .from('works')
        .select('*', { count: 'exact', head: true })
        .eq('composer_id', currentUser.id)
        .eq('status', 'pending');

    document.getElementById('stat-works').textContent = worksCount || 0;
    document.getElementById('stat-pending').textContent = pendingCount || 0;
    
    const countBadge = document.getElementById('validation-count');
    if (pendingCount > 0) {
        countBadge.textContent = pendingCount;
        countBadge.classList.remove('hidden');
    } else {
        countBadge.classList.add('hidden');
    }
}

async function loadValidations() {
    const container = document.getElementById('validations-list');
    const { data: validations, error } = await supabase
        .from('works')
        .select(`
            *,
            profiles:submitted_by (first_name, last_name, role)
        `)
        .eq('composer_id', currentUser.id)
        .eq('status', 'pending');

    if (error || !validations || validations.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-500 py-10 text-center">No pending validation requests.</p>';
        return;
    }

    container.innerHTML = validations.map(v => `
        <div class="glass-panel p-6 rounded-3xl flex items-center gap-6 group hover:border-salmon/30 transition-all">
            <div class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                <span class="material-symbols-outlined text-slate-500">groups</span>
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-white">${v.title}</h4>
                <p class="text-xs text-slate-400">Performed by: ${v.profiles.first_name} ${v.profiles.last_name} (${v.profiles.role})</p>
            </div>
            <div class="flex gap-2">
                <button onclick="handleValidation(${v.id}, 'rejected')" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-all">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
                <button onclick="handleValidation(${v.id}, 'validated')" class="w-10 h-10 rounded-full bg-salmon/20 text-salmon flex items-center justify-center hover:bg-salmon hover:text-white transition-all">
                    <span class="material-symbols-outlined text-[20px]">check</span>
                </button>
            </div>
        </div>
    `).join('');
}

async function handleValidation(workId, newStatus) {
    const { error } = await supabase
        .from('works')
        .update({ status: newStatus })
        .eq('id', workId);

    if (error) {
        alert("Error updating status: " + error.message);
    } else {
        await loadStats();
        await loadValidations();
        await loadMyWorks();
    }
}

async function loadMyWorks() {
    const container = document.getElementById('my-works-list');
    const { data: works } = await supabase
        .from('works')
        .select('*')
        .eq('composer_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (!works || works.length === 0) {
        container.innerHTML = '<p class="text-[10px] text-slate-500 uppercase font-bold text-center py-4">No works registered</p>';
        return;
    }

    container.innerHTML = works.map(w => `
        <div class="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group">
            <div>
                <p class="text-xs font-bold text-white group-hover:text-salmon transition-colors">${w.title}</p>
                <p class="text-[9px] text-slate-500 uppercase tracking-widest">${w.year} • ${w.status}</p>
            </div>
            ${w.status === 'validated' ? '<span class="material-symbols-outlined text-emerald-400 text-sm">verified</span>' : '<span class="material-symbols-outlined text-amber-400 text-sm">pending</span>'}
        </div>
    `).join('');
}

function showSection(sectionId) {
    // Hide all
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('sidebar-item-active', 'text-white'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.add('text-slate-400'));

    // Show selected
    const section = document.getElementById('section-' + sectionId);
    if (section) {
        section.classList.remove('hidden');
        const nav = document.getElementById('nav-' + sectionId);
        if (nav) {
            nav.classList.add('sidebar-item-active', 'text-white');
            nav.classList.remove('text-slate-400');
        }
    }
}

// UI Functions
window.showSection = showSection;

window.openWorkModal = () => {
    document.getElementById('work-modal').classList.remove('hidden');
    document.getElementById('work-modal').classList.add('flex');
};

window.closeWorkModal = () => {
    document.getElementById('work-modal').classList.add('hidden');
    document.getElementById('work-modal').classList.remove('flex');
};

window.saveWork = async () => {
    const title = document.getElementById('work-title').value;
    const year = document.getElementById('work-year').value;
    const link = document.getElementById('work-link').value;

    if (!title) return alert("Title is required");

    const { error } = await supabase
        .from('works')
        .insert({
            title,
            year: parseInt(year),
            composer_id: currentUser.id,
            submitted_by: currentUser.id,
            status: 'validated' // Since the composer is uploading it, it's auto-validated
        });

    if (error) {
        alert("Error saving work: " + error.message);
    } else {
        closeWorkModal();
        await loadStats();
        await loadMyWorks();
        // Reset form
        document.getElementById('work-title').value = '';
        document.getElementById('work-link').value = '';
    }
};

document.addEventListener('DOMContentLoaded', init);
