import { createRouter, createWebHistory } from 'vue-router'

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

export default router