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
    await loadSubmissions();

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
        const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Performer';
        document.getElementById('user-name').textContent = name;
        document.getElementById('welcome-name').textContent = name;

        if (profile.avatar_url) {
            document.getElementById('user-avatar').src = profile.avatar_url;
        } else {
            document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E57373&color=fff`;
        }
    }
}

async function loadStats() {
    const { data: submissions } = await supabase
        .from('works')
        .select('status')
        .eq('submitted_by', currentUser.id);

    const total = submissions?.length || 0;
    const accepted = submissions?.filter(s => s.status === 'validated').length || 0;
    const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-accepted').textContent = accepted;
    document.getElementById('stat-rate').textContent = rate + '%';
}

async function loadSubmissions() {
    const { data: submissions, error } = await supabase
        .from('works')
        .select(`
            *,
            composer:composer_id (first_name, last_name)
        `)
        .eq('submitted_by', currentUser.id)
        .order('created_at', { ascending: false });

    const tableBody = document.getElementById('recent-table-body');
    const fullList = document.getElementById('full-submissions-list');

    if (error || !submissions || submissions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-10 text-center text-slate-500">No submissions found.</td></tr>';
        fullList.innerHTML = '<p class="text-slate-500">You haven\'t submitted any interpretations yet.</p>';
        return;
    }

    // Render table (Top 5)
    tableBody.innerHTML = submissions.slice(0, 5).map(s => `
        <tr class="hover:bg-white/2 transition-colors">
            <td class="px-6 py-4 font-bold text-white text-sm">${s.title}</td>
            <td class="px-6 py-4 text-slate-400 text-sm">${s.composer.first_name} ${s.composer.last_name}</td>
            <td class="px-6 py-4">
                <span class="status-badge ${getStatusClass(s.status)}">${s.status}</span>
            </td>
        </tr>
    `).join('');

    // Render full cards
    fullList.innerHTML = submissions.map(s => `
        <div class="glass-panel p-6 rounded-3xl space-y-3">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-white">${s.title}</h4>
                    <p class="text-xs text-slate-500">Composer: ${s.composer.first_name} ${s.composer.last_name}</p>
                </div>
                <span class="status-badge ${getStatusClass(s.status)}">${s.status}</span>
            </div>
            <div class="pt-2">
                <p class="text-[10px] text-slate-500 uppercase font-bold">Submitted on</p>
                <p class="text-xs text-white">${new Date(s.created_at).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

function getStatusClass(status) {
    switch (status) {
        case 'validated': return 'bg-emerald-500/20 text-emerald-400';
        case 'pending': return 'bg-amber-500/20 text-amber-400';
        case 'rejected': return 'bg-rose-500/20 text-rose-400';
        default: return 'bg-slate-500/20 text-slate-400';
    }
}

// Global search in modal
let searchTimeout;
window.searchWorks = async (query) => {
    const resultsDiv = document.getElementById('search-results');
    if (query.length < 2) {
        resultsDiv.classList.add('hidden');
        return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const { data: works } = await supabase
            .from('works')
            .select(`
                *,
                composer:composer_id (first_name, last_name)
            `)
            .ilike('title', `%${query}%`)
            .eq('status', 'validated') // Only search for works already validated by composers
            .limit(5);

        if (works && works.length > 0) {
            resultsDiv.innerHTML = works.map(w => `
                <div onclick="selectWork(${w.id}, '${w.title.replace(/'/g, "\\'")}', '${w.composer.first_name} ${w.composer.last_name}')" class="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0">
                    <p class="text-sm font-bold text-white">${w.title}</p>
                    <p class="text-[10px] text-slate-500 uppercase">${w.composer.first_name} ${w.composer.last_name}</p>
                </div>
            `).join('');
            resultsDiv.classList.remove('hidden');
        } else {
            resultsDiv.innerHTML = '<p class="p-3 text-xs text-slate-500">No results found</p>';
            resultsDiv.classList.remove('hidden');
        }
    }, 300);
};

window.selectWork = (id, title, composer) => {
    document.getElementById('selected-work-id').value = id;
    document.getElementById('selected-title').textContent = title;
    document.getElementById('selected-composer').textContent = composer;
    document.getElementById('selected-work-info').classList.remove('hidden');
    document.getElementById('search-results').classList.add('hidden');
    document.getElementById('search-work-input').value = '';
};

window.submitInterpretation = async () => {
    const workId = document.getElementById('selected-work-id').value;
    const title = document.getElementById('selected-title').textContent;
    const link = document.getElementById('performance-link').value;

    if (!workId) return alert("Please select a work from the archive");

    // Get the composer_id from the original work to notify them
    const { data: originalWork } = await supabase
        .from('works')
        .select('composer_id, year')
        .eq('id', workId)
        .single();

    const { error } = await supabase
        .from('works')
        .insert({
            title: title + " (Interpretation)",
            year: originalWork.year,
            composer_id: originalWork.composer_id,
            submitted_by: currentUser.id,
            status: 'pending' // Musician submissions are always pending validation
        });

    if (error) {
        alert("Error submitting: " + error.message);
    } else {
        alert("Interpretation submitted! The composer will be notified.");
        closeSubmissionModal();
        await loadStats();
        await loadSubmissions();
    }
};

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('sidebar-item-active', 'text-white'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.add('text-slate-400'));

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

window.showSection = showSection;
window.openSubmissionModal = () => document.getElementById('submission-modal').classList.remove('hidden', 'flex') || document.getElementById('submission-modal').classList.add('flex');
window.closeSubmissionModal = () => document.getElementById('submission-modal').classList.add('hidden') || document.getElementById('submission-modal').classList.remove('flex');

document.addEventListener('DOMContentLoaded', init);
