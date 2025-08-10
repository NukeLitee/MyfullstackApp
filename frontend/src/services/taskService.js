import api from './api';
const API_BASE_URL = process.env.REACT_APP_API_URL + '/api/tasks';
const getToken = () => localStorage.getItem('authToken');

const taskService = {
    getAllTasks: () => api.get('/tasks'),
    getUpcomingTasks: () => api.get('/tasks/upcomingpage'),
    getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
    getCompletedTasks: () => api.get('/tasks/completed'),
    createTask: (taskData) => api.post('/tasks', taskData),
    deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
    toggleTask: (taskId) => api.patch(`/tasks/${taskId}/toggle`),

};

export default taskService;