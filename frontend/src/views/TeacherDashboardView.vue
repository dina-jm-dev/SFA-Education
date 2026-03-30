<script setup>
import { ref, onMounted } from 'vue';
import '../assets/styles/variables.css';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import courseService from '../services/courseService';
import { PlayCircleIcon, PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';

const courses = ref([]);
const loading = ref(true);
const showAddCourseForm = ref(false);
const newCourse = ref({ title: '', description: '', duration: '', profile_picture: '' });

const isUploading = ref(false);

const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    isUploading.value = true;
    try {
        const res = await courseService.uploadFile(file);
        newCourse.value.profile_picture = res.data.fileUrl || res.data.url;
    } catch (e) { 
        console.error('Erreur upload:', e); 
        alert("Erreur lors de l'upload.");
    } finally { 
        isUploading.value = false; 
    }
};

const fetchCourses = async () => {
    try {
        const res = await courseService.getAllCourses();
        courses.value = res.data;
    } catch (e) { console.error(e); }
    finally { loading.value = false; }
};

const handleCreateCourse = async () => {
    try {
        await courseService.createCourse(newCourse.value);
        showAddCourseForm.value = false;
        newCourse.value = { title: '', description: '', duration: '', profile_picture: '' };
        await fetchCourses();
    } catch (e) { console.error(e); }
};

const handleDeleteCourse = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
        try {
            await courseService.deleteCourse(id);
            await fetchCourses();
        } catch (e) { console.error(e); }
    }
};

onMounted(fetchCourses);

</script>

<template>
    <div class="dashboard-page">
        <AppHeader />
        
        <div class="dashboard-container">
            <header class="dashboard-head">
                <h1>Mon Espace Enseignant</h1>
                <p>Gérez vos cours, chapitres et leçons facilement.</p>
                <button class="btn-primary" @click="showAddCourseForm = !showAddCourseForm">
                    <component :is="PlusCircleIcon" class="icon-inline" /> 
                    {{ showAddCourseForm ? 'Fermer' : 'Créer un Cours' }}
                </button>
            </header>

            <div v-if="showAddCourseForm" class="form-container">
                <h3>Nouveau Cours</h3>
                <form @submit.prevent="handleCreateCourse">
                    <div class="form-group">
                        <label>Titre du cours</label>
                        <input type="text" v-model="newCourse.title" required />
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea v-model="newCourse.description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Durée (ex: 10 Heures)</label>
                        <input type="text" v-model="newCourse.duration" required />
                    </div>
                    <div class="form-group">
                        <label>Support de cours (Image / PDF / MP4)</label>
                        <input type="file" @change="handleFileChange" accept="image/*,.pdf,.mp4" class="file-input" />
                        <span v-if="isUploading" class="upload-status">Upload en cours... Veuillez patienter.</span>
                        <span v-else-if="newCourse.profile_picture" class="upload-success">Fichier prêt !</span>
                    </div>
                    <button type="submit" class="btn-submit" :disabled="isUploading">Enregistrer</button>
                </form>
            </div>

            <div v-if="loading" class="loader">Chargement...</div>
            <div v-else class="courses-list">
                <div v-for="course in courses" :key="course.id" class="course-card">
                    <div class="course-info">
                        <h3>{{ course.title }} <span class="badge">{{ course.duration }}</span></h3>
                        <p>{{ course.description }}</p>
                    </div>
                    <div class="course-actions">
                        <button class="btn-icon danger" @click="handleDeleteCourse(course.id)">
                            <component :is="TrashIcon" class="icon-btn" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <AppFooter />
    </div>
</template>

<style scoped>
* {
    font-family: var(--font-family);
}
.dashboard-page {
    padding-top: 80px;
    background: #f8f9fa;
    min-height: 100vh;
}
.dashboard-container {
    max-width: 1000px;
    margin: 40px auto;
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.dashboard-head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-bottom: 2px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 30px;
}
.dashboard-head h1 { font-size: 2.2rem; margin-bottom: 5px; color: var(--bs-black); }
.dashboard-head p { color: #666; margin-bottom: 20px; }

.btn-primary {
    background: var(--global-primary-color);
    color: #fff;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}
.btn-primary:hover { background: var(--global-secondary-color); }

.icon-inline { width: 20px; height: 20px; }
.icon-btn { width: 20px; height: 20px; }

.form-container {
    background: #fdfdfd;
    border: 1px solid #eee;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 5px;
}
.form-group input, .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: inherit;
}
.file-input {
    padding: 8px;
    background: #f9f9f9;
}
.upload-status { font-size: 0.85rem; color: #f59e0b; margin-top: 5px; display: block; }
.upload-success { font-size: 0.85rem; color: #10b981; margin-top: 5px; display: block; }

.btn-submit {
    background: #10b981;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
}
.btn-submit:hover { background: #059669; }

.courses-list { display: flex; flex-direction: column; gap: 15px; }
.course-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 1px solid #eee;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}
.course-info h3 { margin: 0 0 5px 0; display: flex; align-items: center; gap: 10px; }
.course-info p { margin: 0; color: #666; font-size: 0.9rem; }
.badge { background: #e0f2fe; color: #0284c7; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; }

.course-actions { display: flex; gap: 10px; }
.btn-icon {
    background: #f1f5f9;
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    color: #475569;
}
.btn-icon:hover { background: #e2e8f0; }
.btn-icon.danger { color: #ef4444; background: #fee2e2; }
.btn-icon.danger:hover { background: #fecaca; }

.loader { text-align: center; padding: 40px; color: #666; }
</style>
