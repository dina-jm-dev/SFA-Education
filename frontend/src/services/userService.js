import api from './api';

export default {
    getUsers() {
        return api.get('/users');
    },
    createUser(userData) {
        return api.post('/users', userData);
    },
    deleteUser(id) {
        return api.delete(`/users/${id}`);
    }
};
