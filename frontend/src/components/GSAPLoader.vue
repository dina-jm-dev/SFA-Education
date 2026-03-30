<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import axios from 'axios'

const emit = defineEmits(['loaded'])
const showLoader = ref(true)

// état de progression
const progress = ref(0)

onMounted(() => {

    const tl = gsap.timeline()

    // 1. animation texte (lettres qui montent)
    tl.to('.loader-text span', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power4.out'
    })

    // 2. pulse effect (toujours actif)
    gsap.to('.progress-bar', {
        opacity: 0.6,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: 'power1.inOut'
    })

    // 3. requête backend (progress réel)
    axios.get('http://localhost:3000/api/cours', {
        onDownloadProgress: (e) => {
            if (e.lengthComputable) {
                progress.value = (e.loaded / e.total) * 100
            } else {
                // fallback si serveur ne donne pas la taille
                progress.value += 5
            }

            gsap.to('.progress-bar', {
                width: progress.value + '%',
                duration: 0.2
            })
        }
    })
    .then(() => {
        // garantir 100%
        gsap.to('.progress-bar', {
            width: '100%',
            duration: 0.3
        })

        // sortie loader
        gsap.to('.loader-overlay', {
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            onComplete: () => {
                gsap.to('.loader-overlay', {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        showLoader.value = false
                        emit('loaded')
                    }
                })
            }
        })
    })
    .catch(() => {
        // fallback si erreur backend
        gsap.to('.progress-bar', {
            width: '100%',
            duration: 1
        })

        setTimeout(() => {
            showLoader.value = false
            emit('loaded')
        }, 1500)
    })
})
</script>

<template>
    <div v-if="showLoader" class="loader-overlay">
        <div class="loader-content">

            <h1 class="loader-text">
                <span v-for="(char, index) in 'SFAEducation'" :key="index">
                    {{ char }}
                </span>
            </h1>

            <!-- barre -->
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.loader-overlay {
    position: fixed;
    inset: 0;
    background: #f5f5f5;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* contenu */
.loader-content {
    text-align: center;
}

/* texte */
.loader-text {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(1.2rem, 4vw, 2.5rem);
    font-weight: 800;
    color: var(--global-primary-color);
    display: flex;
    justify-content: center;
    overflow: hidden;
}

/* lettres */
.loader-text span {
    display: inline-block;
    opacity: 0;
    transform: translateY(120px);
}

/* barre */
.progress-container {
    width: 220px;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    margin: 25px auto 0;
    border-radius: 2px;
    overflow: hidden;
}

.progress-bar {
    width: 0%;
    height: 100%;
    background: var(--global-primary-color);
    border-radius: 2px;

    /* glow barre */
    box-shadow: 0 0 10px rgba(255, 156, 2, 0.5);
}
</style>