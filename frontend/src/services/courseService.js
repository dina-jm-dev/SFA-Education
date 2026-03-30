import api from './api';

export default {
    getAllCourses() {
        return api.get('/courses');
    },
    getCourseById(id) {
        return api.get(`/courses/${id}`);
    },
    createCourse(courseData) {
        return api.post('/courses', courseData);
    },
    updateCourse(id, courseData) {
        return api.put(`/courses/${id}`, courseData);
    },
    deleteCourse(id) {
        return api.delete(`/courses/${id}`);
    },

    // --- Chapters ---
    createChapter(chapterData) {
        return api.post('/chapters', chapterData);
    },
    updateChapter(id, chapterData) {
        return api.put(`/chapters/${id}`, chapterData);
    },
    deleteChapter(id) {
        return api.delete(`/chapters/${id}`);
    },

    // --- Lessons ---
    createLesson(lessonData) {
        return api.post('/lessons', lessonData);
    },
    updateLesson(id, lessonData) {
        return api.put(`/lessons/${id}`, lessonData);
    },
    deleteLesson(id) {
        return api.delete(`/lessons/${id}`);
    },

    // --- Enrollments ---
    enrollCourse(courseId) {
        return api.post('/enrollments', { courseId });
    },
    getMyCourses() {
        return api.get('/enrollments/my-courses');
    },

    // --- Uploads ---
    uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
