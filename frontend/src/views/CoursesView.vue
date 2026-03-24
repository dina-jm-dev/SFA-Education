<script setup>
    import AppHeader from '../components/AppHeader.vue';
    import AppFooter from '../components/AppFooter.vue';
    import { ref, onMounted } from 'vue';
    import courseService from '../services/courseService';
    import gsap from 'gsap';
    import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

    const courses = ref([]);
    const filteredCourses = ref([]);
    const loading = ref(true);
    const searchQuery = ref('');

    const fetchCourses = async () => {
        try {
            const response = await courseService.getAllCourses();
            courses.value = response.data;
            filteredCourses.value = response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            loading.value = false;
            setTimeout(animateCards, 100);
        }
    };

    const handleSearch = () => {
        filteredCourses.value = courses.value.filter(c => 
            c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    };

    onMounted(() => {
        fetchCourses();
        gsap.from('.courses-hero h1', { opacity: 0, y: -30, duration: 1, ease: 'power3.out' });
        gsap.from('.courses-hero p', { opacity: 0, y: 20, duration: 1, delay: 0.3, ease: 'power3.out' });
        gsap.from('.search-bar', { opacity: 0, y: 20, duration: 1, delay: 0.5, ease: 'power3.out' });
    });

    const animateCards = () => {
        gsap.from('.course-card', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'all'
        });
    };
</script>

<template>
    <div class="courses-page">
        <AppHeader />
        
        <section class="courses-hero">
            <div class="container">
                <h1>Nos Formations</h1>
                <p>Découvrez notre catalogue complet de cours en Anglais et Informatique.</p>
                <div class="search-bar">
                    <component :is="MagnifyingGlassIcon" class="search-icon" />
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        @input="handleSearch"
                        placeholder="Rechercher un cours..."
                    >
                </div>
            </div>
        </section>

        <section class="courses-list">
            <div class="container">
                <div v-if="loading" class="loader">Chargement...</div>
                <div v-else-if="filteredCourses.length === 0" class="no-results">
                    Aucun cours trouvé pour votre recherche.
                </div>
                <div v-else class="courses-grid">
                    <div v-for="course in filteredCourses" :key="course.id" class="course-card">
                        <div class="course-img">
                            <img src="@/assets/images/wacom-work.jpg" alt="Course Image">
                            <span class="badge">{{ course.duration }}</span>
                        </div>
                        <div class="course-info">
                            <h3>{{ course.title }}</h3>
                            <p>{{ course.description?.substring(0, 120) }}...</p>
                            <div class="course-footer">
                                <span class="teacher">Par {{ course.teacherName }}</span>
                                <a :href="'/courses/' + course.id" class="btn-text">
                                    En savoir plus <component :is="ArrowRightIcon" class="icon-inline" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<style scoped>
    *{
        font-family: var(--font-family);
    }
    .courses-page {
        padding-top: 80px;
    }

    .courses-hero {
        background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
        padding: 80px 20px;
        text-align: center;
    }

    .courses-hero h1 {
        font-size: 3rem;
        margin-bottom: 15px;
        color: var(--bs-black);
    }

    .search-bar {
        max-width: 600px;
        margin: 40px auto 0;
        position: relative;
    }

    .search-bar input {
        width: 100%;
        padding: 15px 20px 15px 50px;
        border: 1px solid #ddd;
        border-radius: 50px;
        font-size: 1rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        outline: none;
        transition: border-color 0.3s ease;
    }

    .search-bar input:focus {
        border-color: var(--global-primary-color);
    }

    .search-icon {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: #999;
    }

    .courses-list {
        padding: 60px 20px;
        min-height: 400px;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 30px;
    }

    .course-card {
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
    }

    .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.1);
    }

    .course-img {
        height: 200px;
        position: relative;
    }

    .course-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(255, 255, 255, 0.9);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--global-primary-color);
    }

    .course-info {
        padding: 20px;
    }

    .course-info h3 {
        margin-bottom: 10px;
        font-size: 1.25rem;
    }

    .course-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        font-size: 0.9rem;
    }

    .icon-inline {
        width: 16px;
        height: 16px;
        display: inline;
        vertical-align: middle;
    }

    .btn-text {
        color: var(--global-primary-color);
        text-decoration: none;
        font-weight: 600;
    }

    .loader, .no-results {
        text-align: center;
        padding: 100px;
        font-size: 1.2rem;
        color: #666;
    }

    @media (max-width: 768px) {
        .courses-hero h1 { font-size: 2rem; }
    }
</style>
