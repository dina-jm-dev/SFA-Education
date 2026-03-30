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
    },
    {
        path: '/student-dashboard',
        name: 'student-dashboard',
        component: () => import('../views/StudentDashboardView.vue')
    },
    {
        path: '/teacher-dashboard',
        name: 'teacher-dashboard',
        component: () => import('../views/TeacherDashboardView.vue'),
        meta: { role: 'Teacher' }
    },
    {
        path: '/admin-dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/AdminDashboardView.vue'),
        meta: { role: 'Administrator' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (to.meta.role && (!user || user.role !== to.meta.role)) {
        // Special case: Administrator can access Teacher dashboard too if needed, 
        // but for now let's stick strictly to roles for clarity.
        if (user?.role === 'Administrator' && to.meta.role === 'Teacher') {
            return next();
        }
        return next({ name: 'login' });
    }
    next();
});

export default router