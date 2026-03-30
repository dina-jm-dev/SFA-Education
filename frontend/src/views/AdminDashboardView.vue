<script setup>
import { ref, onMounted, computed } from 'vue';
import '../assets/styles/variables.css';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import courseService from '../services/courseService';
import userService from '../services/userService';
import { 
    UsersIcon, 
    AcademicCapIcon, 
    ChartBarIcon, 
    TrashIcon, 
    PlusCircleIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const activeTab = ref('stats'); // 'stats', 'users', 'courses'
const users = ref([]);
const courses = ref([]);
const loading = ref(true);

const fetchStats = async () => {
    loading.value = true;
    try {
        const [uRes, cRes] = await Promise.all([
            userService.getUsers(),
            courseService.getAllCourses()
        ]);
        users.value = uRes.data;
        courses.value = cRes.data;
    } catch (e) {
        console.error("Erreur lors de la récupération des données:", e);
    } finally {
        loading.value = false;
    }
};

const handleDeleteUser = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
        try {
            await userService.deleteUser(id);
            users.value = users.value.filter(u => u.id !== id);
        } catch (e) { console.error(e); }
    }
};

const handleDeleteCourse = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
        try {
            await courseService.deleteCourse(id);
            courses.value = courses.value.filter(c => c.id !== id);
        } catch (e) { console.error(e); }
    }
};

const stats = computed(() => {
    return {
        totalUsers: users.value.length,
        totalCourses: courses.value.length,
        teachers: users.value.filter(u => u.role === 'Teacher').length,
        students: users.value.filter(u => u.role === 'Student').length,
        admins: users.value.filter(u => u.role === 'Administrator').length,
    };
});

const teachersList = computed(() => users.value.filter(u => u.role === 'Teacher'));

const handleAssignTeacher = async (courseId, teacherId) => {
    try {
        await courseService.updateCourse(courseId, { teacherId });
        alert('Enseignant assigné avec succès !');
        await fetchStats(); // Refresh list
    } catch (e) {
        console.error(e);
        alert("Erreur lors de l'assignation de l'enseignant.");
    }
};

onMounted(fetchStats);
</script>

<template>
    <div class="admin-page">
        <AppHeader />
        
        <div class="admin-container">
            <header class="admin-head">
                <div class="head-info">
                    <h1>Tableau de bord Administrateur</h1>
                    <p>Bienvenue dans votre espace de gestion globale de la plateforme SFA Education.</p>
                </div>
            </header>

            <nav class="admin-tabs">
                <button :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">
                    <component :is="ChartBarIcon" class="tab-icon" /> Vue d'ensemble
                </button>
                <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
                    <component :is="UsersIcon" class="tab-icon" /> Utilisateurs
                </button>
                <button :class="{ active: activeTab === 'courses' }" @click="activeTab = 'courses'">
                    <component :is="AcademicCapIcon" class="tab-icon" /> Cours
                </button>
            </nav>

            <div v-if="loading" class="loader">
                <div class="spinner-large"></div>
                <p>Chargement des données...</p>
            </div>

            <div v-else class="tab-content">
                <!-- Tab Overview -->
                <section v-if="activeTab === 'stats'" class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue"><component :is="UsersIcon" /></div>
                        <div class="stat-data">
                            <span class="label">Total Utilisateurs</span>
                            <span class="value">{{ stats.totalUsers }}</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon purple"><component :is="AcademicCapIcon" /></div>
                        <div class="stat-data">
                            <span class="label">Total Cours</span>
                            <span class="value">{{ stats.totalCourses }}</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green"><component :is="CheckBadgeIcon" /></div>
                        <div class="stat-data">
                            <span class="label">Enseignants</span>
                            <span class="value">{{ stats.teachers }}</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon amber"><component :is="ExclamationTriangleIcon" /></div>
                        <div class="stat-data">
                            <span class="label">Administrateurs</span>
                            <span class="value">{{ stats.admins }}</span>
                        </div>
                    </div>
                </section>

                <!-- Tab Users -->
                <section v-if="activeTab === 'users'" class="table-section">
                    <div class="section-head">
                        <h3>Liste des Utilisateurs</h3>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td class="user-cell">
                                        <div class="user-avatar" :style="user.profile_picture ? { backgroundImage: `url(${user.profile_picture})` } : {}">
                                            {{ !user.profile_picture ? user.name.charAt(0) : '' }}
                                        </div>
                                        <span>{{ user.name }}</span>
                                    </td>
                                    <td>{{ user.email }}</td>
                                    <td><span :class="['badge-role', user.role.toLowerCase()]">{{ user.role }}</span></td>
                                    <td>
                                        <button class="btn-action delete" @click="handleDeleteUser(user.id)" title="Supprimer">
                                            <component :is="TrashIcon" class="icon-small" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Tab Courses -->
                <section v-if="activeTab === 'courses'" class="table-section">
                    <div class="section-head">
                        <h3>Gestion des Cours</h3>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Enseignant</th>
                                    <th>Durée</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course in courses" :key="course.id">
                                    <td><strong>{{ course.title }}</strong></td>
                                    <td>
                                        <div class="assign-teacher">
                                            <select v-model="course.teacherId" @change="handleAssignTeacher(course.id, course.teacherId)">
                                                <option :value="null">Aucun enseignant</option>
                                                <option v-for="t in teachersList" :key="t.id" :value="t.id">
                                                    {{ t.name }}
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>{{ course.duration }}</td>
                                    <td>
                                        <button class="btn-action delete" @click="handleDeleteCourse(course.id)" title="Supprimer">
                                            <component :is="TrashIcon" class="icon-small" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
        
        <AppFooter />
    </div>
</template>

<style scoped>
*{
    font-family: var(--font-family);
}
.admin-page {
    padding-top: 80px;
    background: #f4f7f9;
    min-height: 100vh;
}
.admin-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
}
.admin-head {
    background: #fff;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    margin-bottom: 25px;
}
.admin-head h1 { font-size: 2.2rem; color: #1e293b; margin-bottom: 8px; font-weight: 800; }
.admin-head p { color: #64748b; font-size: 1.1rem; }

.admin-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
}
.admin-tabs button {
    background: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.admin-tabs button:hover { background: #f8fafc; color: #1e293b; }
.admin-tabs button.active {
    background: var(--global-primary-color);
    color: #fff;
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
}
.tab-icon { width: 20px; height: 20px; }

/* Stats Cards */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}
.stat-card {
    background: #fff;
    padding: 25px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}
.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc; /* Global neutral background */
    color: #64748b;      /* Global neutral icon color */
    border: 1px solid #f1f5f9;
}
.stat-icon svg { width: 30px; height: 30px; }
/* Muted variations instead of bright ones */
.stat-icon.blue { color: #475569; background: #f1f5f9; }
.stat-icon.purple { color: #475569; background: #f1f5f9; }
.stat-icon.green { color: #475569; background: #f1f5f9; }
.stat-icon.amber { color: #475569; background: #f1f5f9; }

.stat-data { display: flex; flex-direction: column; }
.stat-data .label { font-size: 0.9rem; color: #64748b; font-weight: 500; }
.stat-data .value { font-size: 1.8rem; font-weight: 800; color: #1e293b; }

/* Tables */
.table-section {
    background: #fff;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}
.section-head { margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
.section-head h3 { font-size: 1.4rem; color: #1e293b; }

.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 600px; }
th { text-align: left; padding: 15px; background: #f8fafc; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
td { padding: 18px 15px; border-bottom: 1px solid #f1f5f9; color: #334155; }

.user-cell { display: flex; align-items: center; gap: 12px; }
.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e2e8f0;
    color: #475569;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    background-size: cover;
}

.badge-role {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}
.badge-role.administrator { background: #fee2e2; color: #dc2626; }
.badge-role.teacher { background: #f0fdf4; color: #16a34a; }
.badge-role.student { background: #eff6ff; color: #2563eb; }

.btn-action {
    border: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
}
.btn-action.delete { background: #fee2e2; color: #ef4444; }
.btn-action.delete:hover { background: #fecaca; }
.icon-small { width: 18px; height: 18px; }

.assign-teacher select {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 0.85rem;
    background: #fff;
    outline: none;
    cursor: pointer;
    width: 100%;
}
.assign-teacher select:focus { border-color: var(--global-primary-color); }

.loader { text-align: center; padding: 100px 0; color: #64748b; }
.spinner-large {
    width: 50px;
    height: 50px;
    border: 4px solid #e2e8f0;
    border-top-color: var(--global-primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
    .stats-grid { grid-template-columns: 1fr; }
}
</style>
