import { createRouter, createWebHistory } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const $loading = useLoading({
    color: '#FF9C02',
    backgroundColor: '#ffffff',
    loader: 'spinner',
    opacity: 0.9,
    zIndex: 99999
});

let loader = null;

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/courses',
        name: 'courses',
        component: () => import('../views/CoursesView.vue')
    },
    {
        path: '/courses/:id',
        name: 'course-detail',
        component: () => import('../views/CourseDetailView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('../views/SignupView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    loader = $loading.show();
    setTimeout(() => {
        next();
    }, 200); // Effet de chargement
});

router.afterEach(() => {
    if (loader) {
        setTimeout(() => {
            loader.hide();
        }, 100);
    }
});

export default router