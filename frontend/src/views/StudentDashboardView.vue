<script setup>
import { ref, onMounted } from 'vue';
import '../assets/styles/variables.css';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import courseService from '../services/courseService';
import { BookOpenIcon, PlayCircleIcon } from '@heroicons/vue/24/outline';

const myCourses = ref([]);
const loading = ref(true);

const fetchMyCourses = async () => {
    try {
        const res = await courseService.getMyCourses();
        myCourses.value = res.data.map(course => {
            const courseProgress = localStorage.getItem('course_progress_' + course.id) || 0;
            return {
                ...course,
                progress: Math.min(100, Math.round(Number(courseProgress)))
            };
        });
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchMyCourses);
</script>

<template>
    <div class="dashboard-page">
        <AppHeader />
        
        <div class="dashboard-container">
            <header class="dashboard-head">
                <h1>Mes Apprentissages</h1>
                <p>Retrouvez ici tous les cours auxquels vous êtes inscrit(e).</p>
            </header>

            <div v-if="loading" class="loader">Chargement de vos cours...</div>
            <div v-else-if="myCourses.length === 0" class="empty-state">
                <component :is="BookOpenIcon" class="empty-icon" />
                <h3>Vous n'êtes inscrit(e) à aucun cours.</h3>
                <router-link to="/courses" class="btn-primary">Découvrir les formations</router-link>
            </div>
            <div v-else class="courses-grid">
                <div v-for="course in myCourses" :key="course.id" class="course-card">
                    <div class="course-img">
                        <div class="progress-bar"><div class="fill" :style="{ width: course.progress + '%' }"></div></div>
                    </div>
                    <div class="course-info">
                        <h3>{{ course.title }}</h3>
                        <p>Progression: {{ course.progress || 0 }}%</p>
                        <router-link :to="'/courses/' + course.id + '/learn'" class="btn-play">
                            <component :is="PlayCircleIcon" class="icon-inline" /> Continuer
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        
        <AppFooter />
    </div>
</template>

<style scoped>
*{
    font-family: var(--font-family);
}
.dashboard-page {
    padding-top: 80px;
    background: #f8f9fa;
    min-height: 100vh;
}
.dashboard-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
}
.dashboard-head {
    margin-bottom: 40px;
}
.dashboard-head h1 { font-size: 2.2rem; color: var(--bs-black); }
.dashboard-head p { color: #666; font-size: 1.1rem; }

.empty-state {
    text-align: center;
    background: #fff;
    padding: 60px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.empty-icon { width: 60px; height: 60px; color: #ccc; margin-bottom: 20px; }
.btn-primary { background: var(--global-primary-color); color: #fff; padding: 12px 25px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 15px; font-weight: 600; transition: background 0.3s;}
.btn-primary:hover { background: var(--global-secondary-color); }

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}
.course-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.course-img {
    height: 150px;
    background: #e2e8f0;
    position: relative;
}
.progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.3);
}
.fill {
    height: 100%;
    background: #10b981;
}
.course-info {
    padding: 20px;
}
.course-info h3 { margin: 0 0 10px 0; font-size: 1.2rem; }
.course-info p { color: #666; font-size: 0.9rem; margin-bottom: 20px; }
.btn-play {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #f1f5f9;
    color: var(--bs-black);
    text-decoration: none;
    padding: 10px;
    border-radius: 6px;
    font-weight: 600;
    transition: background 0.3s;
}
.btn-play:hover { background: #e2e8f0; }
.icon-inline { width: 22px; height: 22px; color: var(--global-primary-color); }
.loader { text-align: center; padding: 40px; color: #666; font-size: 1.2rem; }
</style>
