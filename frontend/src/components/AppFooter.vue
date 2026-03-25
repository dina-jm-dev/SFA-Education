<script setup>
    import gsap from 'gsap';
    import { ref, onMounted, onUnmounted, computed } from 'vue';
    import '../assets/styles/variables.css';
    import {
        HomeIcon,
        BookOpenIcon,
        ChatBubbleLeftRightIcon,
        FolderIcon,
        AcademicCapIcon,
        UserCircleIcon
    } from '@heroicons/vue/24/outline'
    import { RouterLink } from 'vue-router'

    const scrollY = ref(0)
    const progressRef = ref(null)

    const isScrolled = computed(() => scrollY.value > 20)

    function handleScroll() {
        scrollY.value = window.scrollY
        // Progress bar calculation
        const body = document.body
        const scroll = window.scrollY / (body.scrollHeight - window.innerHeight)
        const percent = Math.min(Math.round(scroll * 100), 100)
        if (progressRef.value) {
            gsap.set(progressRef.value, { width: percent + '%' })
        }
    }

    onMounted(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        // Animate header in
        gsap.from('.app-header', {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.2
        })
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
    })

    const footerLinks = [
        { name: 'Cours', to: '/courses'},
        { name: 'Forum', to: '#forum'},
        { name: 'Chat', to: '#chat'},
        { name: 'Projets', to: '#projets' }
    ]
    const logo = new URL('@/assets/images/strivingforall.org-1757063679967/cropped-Logo-Black-on-Transparent.png', import.meta.url).href
    
    const loginIcon = UserCircleIcon
    const signupIcon = AcademicCapIcon
</script>

<template>
    <footer>
        <div class="footer-content">
            <div class="footer-section brand">
                <div class="footer-logo">
                    <img :src="logo" alt="SFA Logo">
                    <span id="highlight">SFA Education</span>
                </div>
                <p>Éveiller le potentiel, transformer l'avenir par l'éducation.</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-linkedin"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div>
            </div>

            <div class="footer-section links">
                <h3>Liens Rapides</h3>
                <ul>
                    <li v-for="link in footerLinks" :key="link.name">
                        <RouterLink :to="link.to">{{ link.name }}</RouterLink>
                    </li>
                </ul>
            </div>

            <div class="footer-section contact">
                <h3>Contact</h3>
                <p>Email: strivingforall@gmail.com</p>
                <p>Téléphone: +237 695 50 48 18</p>
                <p>Adresse: Douala, Cameroun</p>
            </div>

            <div class="footer-section newsletter">
                <h3>Newsletter</h3>
                <p>Recevez nos dernières actualités.</p>
                <div class="news-input">
                    <input type="email" placeholder="Votre email">
                    <button>OK</button>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 SFA Education. Tous droits réservés. Créé pour Striving For All.</p>
        </div>
    </footer>
</template>

<style scoped>
    *{  
        font-family: 'Poppins', sans-serif;
    }
    a{
        text-decoration: none;
        color: var(--bs-white);
    }
    footer {
        background: #1a1a1a;
        color: #fff;
        padding: 60px 40px 20px;
        position: relative; /* Défixé pour le contenu long */
        width: 100%;
        overflow-x: hidden;
    }

    .footer-content {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1.5fr;
        gap: 40px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .footer-section h3 {
        color: var(--global-primary-color);
        margin-bottom: 20px;
        font-size: 1.2rem;
    }

    .footer-section p {
        line-height: 1.6;
        opacity: 0.8;
        font-size: 0.9rem;
    }

    .footer-logo {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .footer-logo img {
        filter: invert(1);
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .social-links {
        display: flex;
        gap: 15px;
        margin-top: 20px;
    }

    .social-links a {
        color: #fff;
        font-size: 1.2rem;
        transition: color 0.3s ease;
    }

    .social-links a:hover {
        color: var(--global-primary-color);
    }

    .footer-section.links ul {
        list-style: none;
        padding: 0;
    }

    .footer-section.links ul li {
        margin-bottom: 10px;
    }

    .footer-section.links ul li a {
        opacity: 0.8;
        transition: all 0.3s ease;
    }

    .footer-section.links ul li a:hover {
        opacity: 1;
        padding-left: 5px;
        color: var(--global-primary-color);
    }

    .news-input {
        display: flex;
        margin-top: 15px;
    }

    .news-input input {
        padding: 10px;
        border: none;
        border-radius: 4px 0 0 4px;
        flex-grow: 1;
    }

    .news-input button {
        padding: 10px 20px;
        border: none;
        background: var(--global-primary-color);
        color: #fff;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .news-input button:hover {
        background: var(--global-secondary-color);
    }

    .footer-bottom {
        text-align: center;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.8rem;
        opacity: 0.6;
    }

    @media (max-width: 992px) {
        .footer-content {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 576px) {
        .footer-content {
            grid-template-columns: 1fr;
        }
    }
</style>