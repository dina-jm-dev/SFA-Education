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

    const navLinks = [
        { name: 'Cours', to: '/courses', icon: BookOpenIcon },
        { name: 'Forum', to: '#forum', icon: ChatBubbleLeftRightIcon },
        { name: 'Chat', to: '#chat', icon: ChatBubbleLeftRightIcon },
        { name: 'Projets', to: '#projets', icon: FolderIcon },
    ]
    const logo = new URL('@/assets/images/strivingforall.org-1757063679967/cropped-Logo-Black-on-Transparent.png', import.meta.url).href
    
    const loginIcon = UserCircleIcon
    const signupIcon = AcademicCapIcon
</script>

<template>
    <header :class="{ scrolled: isScrolled }">
        <div ref="progressRef" class="scroll-progress"></div>
        <h1><RouterLink to="/"><img :src="logo" alt="SFA Logo"><span id="highlight">SFA Education</span></RouterLink></h1>
        <nav>
            <ul>
                <li v-for="link in navLinks" :key="link.name">
                    <RouterLink :to="link.to">
                        <component :is="link.icon" class="icon" />
                        <span>{{ link.name }}</span>
                    </RouterLink>
                </li>
            </ul>
        </nav>

        <div class="header-actions">
            <RouterLink to="/login" class="btn btn-login">
                <component :is="loginIcon" class="icon-btn" />
                Se connecter
            </RouterLink>
            <RouterLink to="/signup" class="btn btn-signup">
                <component :is="signupIcon" class="icon-btn" />
                S'inscrire
            </RouterLink>
        </div>
    </header>
</template>

<style scoped>

    a{
        text-decoration: none;
        color: var(--bs-black);
    }
    header {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        padding: 0 20px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 9999;
        height: 80px;
        transition: all 0.3s ease;
        overflow-x: hidden;
    }

    header.scrolled {
        height: 70px;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .scroll-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, var(--global-primary-color), var(--global-secondary-color));
        width: 0%;
        transition: width 0.1s ease-out;
    }

    header h1 a img{
        width: 80px;
        height: 80px;
    }
    h1 a{
    text-decoration: none;
    color: var(--bs-black);
    transition: color 0.5s ease;
    font-size: clamp(24px, 3vw, 28px);
    text-decoration: none;
    display: flex;
    align-items: center;
}
h1{
    display: flex;
    justify-content: space-around;
}
#highlight{
    margin-top: -12px;
    font-weight: bold;
    font-size: 1.1em;
    transition: color 0.3s ease;
}
#highlight:hover{
    cursor: pointer;
    color: var(--global-primary-color);
}
h1 a:hover {
    color: var(--global-primary-color);
}
a{
    text-decoration: none;
    color: inherit;
}


#logo{
    height: 50px;
    margin-right: 10px;
}
header img{
    height: 25px;
    margin-right: 5px;
}
nav ul{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}
nav ul li {
    list-style: none;
    margin: 0 15px;
}
nav a {
    color: var(--bs-black);
    transition: color 0.3s ease, opacity 0.3s ease;
    text-decoration: none;
    text-transform: capitalize;
    color: var(--bs-black);
    font-weight: bold;
    font-size: 1rem;
    transition: color 0.3s ease;
    opacity: 0.7;
}

nav a:hover {
    color: var(--global-primary-color);
    opacity: 1;
}
nav img{
    margin-bottom: -7px;
}
.header-actions{
    display: flex;
    justify-content: space-around;
    align-items: center;
    justify-content: center;
    gap: 2px;
    margin-right: 30px;

    & .btn{
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 1em;
    }
    .btn-login{
        background-color: var(--global-primary-color);
        color: var(--bs-white);
    }
    .btn-signup{
        background-color: var(--global-primary-color);
        color: var(--bs-white);
    }
}
.btn-signup:hover {
    background-color: var(--global-secondary-color);

}
.btn-login:hover {
    background: #ECE9E6;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #FFFFFF, #ECE9E6);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #FFFFFF, #ECE9E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: var(--bs-black);
}
@keyframes bg-header {
    0% {background: #e0ddcb;}
    25% {background: #F2F2F2;}
    50% {background: #DBDBDB;}
    75% {background: #EAEAEA;}
    100% {background: #e0ddcb;}
}
.icon {
    width: 25px;
    height: 25px;
    margin-right: 6px;
    margin-bottom: -7px;
}

.icon-btn {
    width: 18px;
    height: 18px;
    margin-right: 6px;
    margin-bottom: -4px;
}
</style>