<script setup>
    import '../assets/styles/variables.css';
    import AppHeader from '../components/AppHeader.vue';
    import AppFooter from '../components/AppFooter.vue';
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import courseService from '../services/courseService';
    import { ClockIcon, UserIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

    const route = useRoute();
    const router = useRouter();
    const course = ref(null);
    const loading = ref(true);
    const isEnrolling = ref(false);
    const alertMessage = ref('');
    const alertType = ref('');

    const isEnrolled = ref(false);
    const completedLessons = ref(JSON.parse(localStorage.getItem('completed_lessons') || '[]'));
    const authState = ref(!!localStorage.getItem('user'));

    const fetchCourseAndStatus = async () => {
        try {
            const response = await courseService.getCourseById(route.params.id);
            course.value = response.data;
            
            if (authState.value) {
                const enrollments = await courseService.getMyCourses();
                isEnrolled.value = enrollments.data.some(c => c.id === course.value.id);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            loading.value = false;
        }
    };

    const toggleLesson = (lessonId) => {
        if (!isEnrolled.value) return;
        const index = completedLessons.value.indexOf(lessonId);
        if (index > -1) {
            completedLessons.value.splice(index, 1);
        } else {
            completedLessons.value.push(lessonId);
        }
        localStorage.setItem('completed_lessons', JSON.stringify(completedLessons.value));
        updateCourseProgress();
    };

    const updateCourseProgress = () => {
        if (!course.value || !course.value.chapters) return;
        let totalLessons = 0;
        let completed = 0;
        
        course.value.chapters.forEach(chap => {
            if(chap.lessons) {
                totalLessons += chap.lessons.length;
                chap.lessons.forEach(l => {
                    if (completedLessons.value.includes(l.id)) completed++;
                });
            }
        });
        
        const progress = totalLessons === 0 ? 0 : (completed / totalLessons) * 100;
        localStorage.setItem('course_progress_' + course.value.id, progress);
    };

    const handleEnroll = async () => {
        if (!authState.value) {
            router.push('/login');
            return;
        }
        isEnrolling.value = true;
        try {
            await courseService.enrollCourse(course.value.id);
            alertType.value = 'success';
            alertMessage.value = 'Vous êtes maintenant inscrit(e) à ce cours !';
            isEnrolled.value = true;
        } catch (err) {
            alertType.value = 'error';
            if (err.response?.status === 400) {
                alertMessage.value = 'Vous êtes déjà inscrit(e) à ce cours.';
                isEnrolled.value = true;
            } else {
                alertMessage.value = 'Erreur lors de l\'inscription.';
            }
        } finally {
            isEnrolling.value = false;
        }
    };

    onMounted(fetchCourseAndStatus);
</script>

<template>
    <div class="course-detail-page">
        <AppHeader />

        <div v-if="loading" class="loader">Chargement du cours...</div>
        <div v-else-if="!course" class="error">Cours introuvable.</div>
        <div v-else>
            <section class="course-hero">
                <div class="container hero-grid">
                    <div class="hero-text">
                        <span class="category-badge">Formation Certifiante</span>
                        <h1>{{ course.title }}</h1>
                        <p class="description">{{ course.description }}</p>
                        <div class="meta-info">
                            <div class="info-item">
                                <component :is="ClockIcon" class="info-icon" />
                                <span>{{ course.duration }}</span>
                            </div>
                            <div class="info-item">
                                <component :is="UserIcon" class="info-icon" />
                                <span>Par {{ course.teacherName }}</span>
                            </div>
                        </div>
                        <div v-if="alertMessage" class="alert-box" :class="alertType">
                            {{ alertMessage }}
                        </div>
                        <button v-if="!isEnrolled" class="btn-enroll" @click="handleEnroll" :disabled="isEnrolling">
                            {{ isEnrolling ? 'Inscription en cours...' : 'S\'inscrire maintenant' }}
                        </button>
                        <div v-else class="btn-enroll enrolled-badge" style="background:#10b981; text-align:center;">
                            Vous suivez ce cours
                        </div>
                    </div>
                    <div class="hero-image">
                        <img src="@/assets/images/wacom-work.jpg" alt="Course Image">
                    </div>
                </div>
            </section>

            <section class="course-content">
                <div class="container grid-layout">
                    <div class="main-content">
                        <h2>À propos de ce cours</h2>
                        <p>{{ course.description }}</p>
                        
                        <div v-if="course.chapters && course.chapters.length > 0" class="curriculum">
                            <h3>Programme du cours</h3>
                            <div v-for="chapter in course.chapters" :key="chapter.id" class="chapter-item">
                                <div class="chapter-header">
                                    <h4>{{ chapter.title }}</h4>
                                    <span class="duration">{{ chapter.duration }}</span>
                                </div>
                                <ul class="lesson-list">
                                    <li v-for="lesson in chapter.lessons" :key="lesson.id" class="lesson-item">
                                        <div style="display:flex; align-items:center; gap: 15px;">
                                            <input 
                                                v-if="isEnrolled" 
                                                type="checkbox" 
                                                :checked="completedLessons.includes(lesson.id)" 
                                                @change="toggleLesson(lesson.id)" 
                                                style="transform: scale(1.3); cursor:pointer; accent-color: var(--global-primary-color);" 
                                            />
                                            <component v-else :is="AcademicCapIcon" class="lesson-icon" />
                                            <span :style="completedLessons.includes(lesson.id) ? 'text-decoration: line-through; color: #999;' : ''">
                                                {{ lesson.title }}
                                            </span>
                                        </div>
                                        <span class="lesson-duration">{{ lesson.duration }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="learning-points">
                            <h3>Ce que vous allez apprendre</h3>
                            <ul>
                                <li><component :is="CheckCircleIcon" class="check-icon" /> Maîtrise complète des concepts théoriques.</li>
                                <li><component :is="CheckCircleIcon" class="check-icon" /> Mise en pratique réelle avec des projets.</li>
                                <li><component :is="CheckCircleIcon" class="check-icon" /> Accès à une communauté d'experts.</li>
                                <li><component :is="CheckCircleIcon" class="check-icon" /> Certificat reconnu par SFA Education.</li>
                            </ul>
                        </div>
                    </div>
                    
                    <aside class="sidebar">
                        <div class="sidebar-card">
                            <h3>Détails du cours</h3>
                            <div class="sidebar-item">
                                <span>Niveau :</span>
                                <strong>Tous niveaux</strong>
                            </div>
                            <div class="sidebar-item">
                                <span>Accès :</span>
                                <strong>À vie</strong>
                            </div>
                            <div class="sidebar-item">
                                <span>Certification :</span>
                                <strong>Oui</strong>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>

        <AppFooter />
    </div>
</template>

<style scoped>
    *{
        font-family: var(--font-family);
    }
    .course-detail-page {
        padding-top: 80px;
    }

    .course-hero {
        background: #f8f9fa;
        padding: 80px 20px;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: center;
    }

    .hero-text h1 {
        font-size: 3rem;
        margin: 20px 0;
        line-height: 1.1;
    }

    .category-badge {
        background: var(--global-primary-color);
        color: #fff;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .description {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 30px;
        line-height: 1.6;
    }

    .meta-info {
        display: flex;
        gap: 20px;
        margin-bottom: 40px;
    }

    .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
    }

    .info-icon {
        width: 20px;
        height: 20px;
        color: var(--global-primary-color);
    }

    .btn-enroll {
        background: var(--global-primary-color);
        color: #fff;
        border: none;
        padding: 15px 40px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .btn-enroll:hover:not(:disabled) {
        background: var(--global-secondary-color);
    }

    .btn-enroll:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .alert-box {
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: 500;
        font-size: 0.95rem;
    }

    .alert-box.success {
        background: #ecfdf5;
        color: #059669;
        border: 1px solid #10b981;
    }

    .alert-box.error {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #ef4444;
    }

    .hero-image img {
        width: 100%;
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.1);
    }

    .course-content {
        padding: 80px 20px;
    }

    .grid-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 60px;
    }

    .main-content h2 {
        font-size: 2rem;
        margin-bottom: 20px;
    }

    .learning-points {
        margin-top: 50px;
        background: #fff;
        padding: 40px;
        border-radius: 15px;
        border: 1px solid #eee;
    }

    .learning-points ul {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 20px;
    }

    .learning-points li {
        display: flex;
        gap: 10px;
        font-size: 0.95rem;
    }

    .check-icon {
        width: 20px;
        height: 20px;
        color: #10b981;
        flex-shrink: 0;
    }

    .curriculum {
        margin-top: 40px;
    }

    .chapter-item {
        background: #fff;
        border: 1px solid #eee;
        border-radius: 12px;
        margin-bottom: 15px;
        overflow: hidden;
    }

    .chapter-header {
        background: #fcfcfc;
        padding: 15px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
    }

    .chapter-header h4 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--bs-black);
    }

    .lesson-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .lesson-item {
        padding: 12px 25px;
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 1px solid #f9f9f9;
        font-size: 0.95rem;
    }

    .lesson-item:last-child {
        border-bottom: none;
    }

    .lesson-icon {
        width: 18px;
        height: 18px;
        color: #999;
    }

    .lesson-duration {
        margin-left: auto;
        font-size: 0.8rem;
        color: #999;
    }

    .duration {
        font-size: 0.85rem;
        color: var(--global-primary-color);
        font-weight: 600;
    }

    .sidebar-card {
        background: #fff;
        padding: 30px;
        border-radius: 15px;
        border: 1px solid #eee;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }

    .sidebar-item {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }

    .loader { text-align: center; padding: 100px; font-size: 1.5rem; }

    @media (max-width: 992px) {
        .hero-grid, .grid-layout { grid-template-columns: 1fr; }
        .hero-text h1 { font-size: 2.2rem; }
    }
</style>
