<script setup>
    import AppHeader from '../components/AppHeader.vue';
    import AppFooter from '../components/AppFooter.vue';
    import '../assets/styles/variables.css';
    import { ref, onMounted } from 'vue';
    import { RouterLink } from 'vue-router';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';
    import courseService from '../services/courseService';
    import {
        PlayCircleIcon,
        AcademicCapIcon,
        UserGroupIcon,
        GlobeAltIcon,
        ArrowRightIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        HeartIcon
    } from '@heroicons/vue/24/outline'

    gsap.registerPlugin(ScrollTrigger);

    const logoHero = new URL('@/assets/images/strivingforall.org-1757063679967/cropped-Logo-Original-on-Transparent-scaled.webp', import.meta.url).href;
    const videoBanner = new URL('@/assets/images/strivingforall.org-1757063679967/web_hero3_dd5eee65ab.mp4', import.meta.url).href;
    const donateImg = new URL('@/assets/images/strivingforall.org-1757063679967/Donate.png', import.meta.url).href;

    const courses = ref([]);
    const loading = ref(true);

    const accomplishments = [
        { label: 'Étudiants formés', count: '500+', icon: UserGroupIcon },
        { label: 'Étudiants certifiés', count: '500+', icon: AcademicCapIcon },
        { label: 'Pays touchés', count: '30+', icon: GlobeAltIcon }
    ];

    const testimonials = [
        { name: "Tenou Kouaya", role: "Étudiant en Informatique", text: "un environnement, un cadre de travail, un milieu propre et sain." },
        { name: "Pam Hanane Kenza", role: "Étudiant en Informatique", text: "Un personnel qualifié et des personnes sociables, la recette de la réussite et de l'épanouissement." },
        { name: "Kengne Nono Andre Junior", role: "Étudiant en Informatique", text: "Tout était parfait." }
    ];

    const currentTestimonial = ref(0);

    const nextTestimonial = () => {
        currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length;
    };

    const prevTestimonial = () => {
        currentTestimonial.value = (currentTestimonial.value - 1 + testimonials.length) % testimonials.length;
    };

    onMounted(async () => {
        // Fetch courses
        try {
            const response = await courseService.getAllCourses();
            courses.value = response.data.slice(0, 3); // Show top 3 on home
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            loading.value = false;
        }

        // Animations
        const title = new SplitType('.hero-content h2', { types: 'words,chars' });
        gsap.from(title.chars, {
            opacity: 0,
            y: 20,
            rotate: 2,
            duration: 0.8,
            stagger: 0.02,
            ease: 'power2.out'
        });

        gsap.from('.hero-content p', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.5,
            ease: 'power3.out'
        });

        const revealOnScroll = (selector, y = 50, scale = 1) => {
            gsap.utils.toArray(selector).forEach(el => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: y,
                    scale: scale,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            });
        };

        revealOnScroll('.accomplishment-card', 30);
        revealOnScroll('.course-card', 20, 1);
        revealOnScroll('.section-header', 20);
        revealOnScroll('.donation-card', 30);
        revealOnScroll('.testimonials h2', 15);
        revealOnScroll('.carousel', 20);
    });
</script>

<template>
    <div class="home-container">
        <AppHeader />

        <!-- Hero Section -->
        <section id="hero-banner">
            <video autoplay muted loop class="hero-video">
                <source :src="videoBanner" type="video/mp4">
            </video>
            <div class="overlay"></div>
            <div class="hero-content">
                <img :src="logoHero" alt="logo" id="logo-hero">
                <h2>L'avenir de l'éducation commence ici</h2>
                <p>Développez vos compétences en Anglais et Informatique avec SFA Education. Rejoignez une communauté mondiale vers le succès.</p>
                <div class="hero-btns">
                    <RouterLink to="/courses" class="btn-primary">Découvrir les cours <component :is="PlayCircleIcon" class="icon-btn" /></RouterLink>
                    <a href="#accomplishments" class="btn-secondary">Nos succès</a>
                </div>
            </div>
        </section>

        <!-- Accomplishments Section -->
        <section id="accomplishments" class="accomplishments">
            <div class="section-container">
                <div class="accomplishments-grid">
                    <div v-for="item in accomplishments" :key="item.label" class="accomplishment-card">
                        <component :is="item.icon" class="acc-icon" />
                        <h3>{{ item.count }}</h3>
                        <p>{{ item.label }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Courses Section -->
        <section id="courses" class="courses">
            <div class="section-container">
                <div class="section-header">
                    <h2>Nos Formations Populaires</h2>
                    <p>Apprenez des meilleurs experts dans votre domaine.</p>
                </div>

                <div v-if="loading" class="loader">Chargement des cours...</div>
                <div v-else class="courses-grid">
                    <div v-for="course in courses" :key="course.id" class="course-card">
                        <div class="course-img">
                            <img src="@/assets/images/wacom-work.jpg" alt="Course Image">
                            <span class="badge">{{ course.duration }}</span>
                        </div>
                        <div class="course-info">
                            <h3>{{ course.title }}</h3>
                            <p>{{ course.description?.substring(0, 100) }}...</p>
                            <div class="course-footer">
                                <span class="teacher">Par {{ course.teacherName }}</span>
                                <RouterLink :to="'/courses/' + course.id" class="btn-text">Voir plus <component :is="ArrowRightIcon" class="icon-inline" /></RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <RouterLink to="/courses" class="btn-outline">Voir tous les cours</RouterLink>
                </div>
            </div>
        </section>

        <!-- Testimonials Carousel -->
        <section id="testimonials" class="testimonials">
            <div class="section-container">
                <h2>Ce que les gens disent</h2>
                <div class="carousel">
                    <button @click="prevTestimonial" class="carousel-btn"><component :is="ChevronLeftIcon" class="icon-nav" /></button>
                    <div class="testimonial-content">
                        <transition name="fade" mode="out-in">
                            <div :key="currentTestimonial" class="testimonial-card">
                                <p>"{{ testimonials[currentTestimonial].text }}"</p>
                                <h4>{{ testimonials[currentTestimonial].name }}</h4>
                                <span>{{ testimonials[currentTestimonial].role }}</span>
                            </div>
                        </transition>
                    </div>
                    <button @click="nextTestimonial" class="carousel-btn"><component :is="ChevronRightIcon" class="icon-nav" /></button>
                </div>
            </div>
        </section>

        <!-- Donation Section -->
        <section id="donation" class="donation">
            <div class="section-container">
                <div class="donation-card">
                    <div class="donation-img">
                        <img :src="donateImg" alt="Faire un don">
                    </div>
                    <div class="donation-text">
                        <h2>Soutenez notre mission</h2>
                        <p>Votre don aide Striving For All à fournir une éducation de qualité et des outils technologiques aux communautés défavorisées. Ensemble, créons un impact durable.</p>
                        <a href="https://strivingforall.org/donate" target="_blank" class="btn-donate">
                            Faire un don <component :is="HeartIcon" class="icon-btn" />
                        </a>
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
    /* Sections */
    section {
        padding: 100px 20px;
    }

    .section-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .section-header {
        text-align: center;
        margin-bottom: 60px;
    }

    .section-header h2 {
        font-size: 2.5rem;
        color: var(--bs-black);
        margin-bottom: 15px;
    }

    /* Hero Banner */
    #hero-banner {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        text-align: center;
        color: #fff;
        padding: 0;
    }

    .hero-video {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 0;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        max-width: 800px;
    }

    #logo-hero {
        width: 35%;
        margin-top: 10px;
    }

    .hero-content h2 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 800;
        margin-bottom: 20px;
        line-height: 1.1;
    }

    .hero-btns {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin-top: 40px;
    }

    /* Accomplishments */
    .accomplishments {
        background: #f8f9fa;
        padding: 80px 20px;
    }

    .accomplishments-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
    }

    .accomplishment-card {
        background: #fff;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        border: 1px solid transparent;
        transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .accomplishment-card:hover {
        background-color: #f8f9fa;
        border-color: var(--global-primary-color);
    }

    .acc-icon {
        width: 50px;
        height: 50px;
        color: var(--global-primary-color);
        margin: 0 auto 20px;
    }

    /* Courses */
    .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 40px;
    }

    .course-card {
        background: #fff;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        border: 1px solid transparent;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .course-card:hover {
        border-color: var(--global-primary-color);
        box-shadow: 0 20px 50px rgba(0,0,0,0.12);
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
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        padding: 5px 15px;
        border-radius: 30px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--global-primary-color);
    }

    .course-info {
        padding: 25px;
    }

    .course-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #eee;
    }

    /* Testimonials */
    .testimonials {
        background: linear-gradient(135deg, var(--global-primary-color), var(--global-secondary-color));
        color: #fff;
        text-align: center;
    }

    .testimonials h2 {
        margin-bottom: 50px;
        color: #fff;
    }

    .carousel {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 40px;
    }

    .testimonial-card {
        max-width: 600px;
        font-style: italic;
    }

    .testimonial-card p {
        font-size: 1.5rem;
        margin-bottom: 30px;
    }

    .carousel-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: #fff;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    }

    .carousel-btn:hover {
        background: #fff;
        color: var(--global-primary-color);
    }

    /* Donation */
    .donation-card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        background: #fff;
        border-radius: 30px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        align-items: center;
    }

    .donation-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .donation-text {
        padding: 60px;
    }

    .btn-donate {
        display: inline-flex;
        align-items: center;
        background: #e63946;
        color: #fff;
        padding: 15px 35px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 700;
        margin-top: 30px;
        transition: all 0.3s ease;
    }

    .btn-donate:hover {
        background: #c12e3a;
        opacity: 0.9;
        box-shadow: 0 10px 20px rgba(230, 57, 70, 0.3);
    }

    /* Buttons & Utils */
    .btn-primary {
        background: var(--global-primary-color);
        color: #fff;
        padding: 15px 35px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: background-color 0.3s ease;
    }

    .btn-primary:hover{
        background-color: var(--global-secondary-color);
    }

    .btn-secondary {
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(5px);
        color: #fff;
        padding: 15px 35px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s ease;
    }
    .btn-secondary:hover{
        background-color: var(--bs-white);
        color: var(--bs-black);
    }

    .btn-outline {
        border: 2px solid var(--global-primary-color);
        color: var(--global-primary-color);
        padding: 12px 30px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .btn-outline:hover {
        background: var(--global-primary-color);
        color: #fff;
    }

    .icon-btn { width: 24px; height: 24px; }
    .icon-inline { width: 18px; height: 18px; display: inline; vertical-align: middle; }
    .icon-nav { width: 30px; height: 30px; }

    .fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
    .fade-enter-from, .fade-leave-to { opacity: 0; }

    @media (max-width: 768px) {
        .donation-card { grid-template-columns: 1fr; }
        .hero-btns { flex-direction: column; }
        .carousel { gap: 10px; }
        .testimonial-card p { font-size: 1.1rem; }
    }
</style>
