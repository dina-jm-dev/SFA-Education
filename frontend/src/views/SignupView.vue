<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import api from '../services/api';
    import { UserIcon, LockClosedIcon, EnvelopeIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

    const router = useRouter();
    const name = ref('');
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const error = ref('');

    const signup = async () => {
        try {
            await api.post('/auth/register', {
                name: name.value,
                username: username.value,
                email: email.value,
                password: password.value,
                role: 'Student'
            });
            router.push('/login');
        } catch (err) {
            error.value = 'Erreur lors de l\'inscription.';
        }
    };
</script>

<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-left">
                <a href="/" class="back-link"><component :is="ArrowLeftIcon" class="icon-inline" /> Retour</a>
                <div class="form-container">
                    <h1>S'inscrire</h1>
                    <p>Rejoignez SFA Education dès aujourd'hui.</p>
                    
                    <div v-if="error" class="error-msg">{{ error }}</div>

                    <form @submit.prevent="signup">
                        <div class="input-group">
                            <label>Nom complet</label>
                            <div class="input-wrapper">
                                <component :is="UserIcon" class="input-icon" />
                                <input type="text" v-model="name" required placeholder="Votre nom complet">
                            </div>
                        </div>

                        <div class="input-group">
                            <label>Nom d'utilisateur</label>
                            <div class="input-wrapper">
                                <component :is="UserIcon" class="input-icon" />
                                <input type="text" v-model="username" required placeholder="Choisissez un pseudo">
                            </div>
                        </div>

                        <div class="input-group">
                            <label>Email</label>
                            <div class="input-wrapper">
                                <component :is="EnvelopeIcon" class="input-icon" />
                                <input type="email" v-model="email" required placeholder="votre@email.com">
                            </div>
                        </div>

                        <div class="input-group">
                            <label>Mot de passe</label>
                            <div class="input-wrapper">
                                <component :is="LockClosedIcon" class="input-icon" />
                                <input type="password" v-model="password" required placeholder="••••••••">
                            </div>
                        </div>

                        <button type="submit" class="btn-auth">Créer mon compte</button>
                    </form>

                    <p class="auth-footer">
                        Déjà un compte ? <a href="/login">Connectez-vous</a>
                    </p>
                </div>
            </div>
            <div class="auth-right">
                <div class="image-overlay">
                    <h2>"Investir dans la connaissance paie toujours les meilleurs intérêts."</h2>
                    <span>Benjamin Franklin</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    *{
        font-family: var(--font-family);
    }
    /* Styles identiques à LoginView.vue */
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
        height: 700px; /* Légèrement plus haut pour le champ supplémentaire */
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
        margin: 40px auto 0;
    }

    .form-container h1 { font-size: 2rem; margin-bottom: 5px; }
    .form-container p { color: #888; margin-bottom: 30px; }

    .input-group { margin-bottom: 15px; }
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

    .auth-footer { text-align: center; margin-top: 25px; font-size: 0.9rem; color: #666; }
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

    @media (max-width: 900px) {
        .auth-right { display: none; }
        .auth-card { width: 450px; height: auto; }
    }
</style>
