import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    NProgress.start();
    return config;
}, error => {
    NProgress.done();
    return Promise.reject(error);
});

api.interceptors.response.use(response => {
    NProgress.done();
    return response;
}, error => {
    NProgress.done();
    return Promise.reject(error);
});

export default api;
