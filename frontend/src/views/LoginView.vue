<script setup>
    import '../assets/styles/variables.css';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import api from '../services/api';
    import { UserIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const error = ref('');
    const isLoading = ref(false);

    const login = async () => {
        isLoading.value = true;
        try {
            const response = await api.post('/auth/login', {
                identifier: username.value,
                password: password.value
            });
            const userData = response.data.user;
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Redirection selon le rôle
            if (userData.role === 'Administrator' || userData.role === 'Teacher') {
                router.push('/teacher-dashboard');
            } else {
                router.push('/student-dashboard');
            }
        } catch (err) {
            error.value = 'Identifiants incorrects.';
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-left">
                <a href="/" class="back-link"><component :is="ArrowLeftIcon" class="icon-inline" /> Retour</a>
                <div class="form-container">
                    <h1>Se connecter</h1>
                    <p>Bon retour parmi nous !</p>
                    
                    <div v-if="error" class="error-msg">{{ error }}</div>

                    <form @submit.prevent="login">
                        <div class="input-group">
                            <label>Nom d'utilisateur ou Email</label>
                            <div class="input-wrapper">
                                <component :is="UserIcon" class="input-icon" />
                                <input type="text" v-model="username" required placeholder="Entrez votre pseudo ou email">
                            </div>
                        </div>

                        <div class="input-group">
                            <label>Mot de passe</label>
                            <div class="input-wrapper">
                                <component :is="LockClosedIcon" class="input-icon" />
                                <input type="password" v-model="password" required placeholder="••••••••">
                            </div>
                        </div>

                        <button type="submit" class="btn-auth" :disabled="isLoading">
                            <span v-if="isLoading" class="spinner"></span>
                            <span v-else>Connexion</span>
                        </button>
                    </form>

                    <p class="auth-footer">
                        Pas encore de compte ? <a href="/signup">Inscrivez-vous</a>
                    </p>
                </div>
            </div>
            <div class="auth-right">
                <div class="image-overlay">
                    <h2>"L'éducation est l'arme la plus puissante pour changer le monde."</h2>
                    <span>Nelson Mandela</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    *{
        font-family: var(--font-family);
    }
    .auth-page {
        height: 100vh;
        background: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .auth-card {
        background: #fff;
        width: 1000px;
        height: 600px;
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }

    .auth-left {
        flex: 1;
        padding: 40px;
        position: relative;
    }

    .back-link {
        text-decoration: none;
        color: #666;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .form-container {
        max-width: 350px;
        margin: 60px auto 0;
    }

    .form-container h1 { font-size: 2rem; margin-bottom: 5px; }
    .form-container p { color: #888; margin-bottom: 30px; }

    .input-group { margin-bottom: 20px; }
    .input-group label { display: block; font-size: 0.9rem; margin-bottom: 8px; font-weight: 500; }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon {
        position: absolute;
        left: 15px;
        width: 18px;
        height: 18px;
        color: #999;
    }

    .input-wrapper input {
        width: 100%;
        padding: 12px 15px 12px 45px;
        border: 1px solid #ddd;
        border-radius: 8px;
        outline: none;
        transition: border-color 0.3s;
    }

    .input-wrapper input:focus { border-color: var(--global-primary-color); }

    .btn-auth {
        width: 100%;
        background: var(--global-primary-color);
        color: #fff;
        border: none;
        padding: 14px;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 10px;
        transition: background 0.3s;
    }

    .btn-auth:hover { background: var(--global-secondary-color); }

    .auth-footer { text-align: center; margin-top: 30px; font-size: 0.9rem; color: #666; }
    .auth-footer a { color: var(--global-primary-color); font-weight: 600; text-decoration: none; }

    .auth-right {
        flex: 1;
        background: url('@/assets/images/wacom-work.jpg') no-repeat center center;
        background-size: cover;
        position: relative;
    }

    .image-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.4);
        padding: 60px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        color: #fff;
    }

    .image-overlay h2 { font-size: 1.5rem; line-height: 1.4; margin-bottom: 10px; font-style: italic; }
    .image-overlay span { font-weight: 600; font-size: 1rem; }

    .error-msg { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; }
    .icon-inline { width: 16px; height: 16px; }

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        vertical-align: middle;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media (max-width: 900px) {
        .auth-right { display: none; }
        .auth-card { width: 450px; height: auto; }
    }
</style>