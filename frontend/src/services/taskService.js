import api from './api';

const taskService = {
    getAllTasks: () => api.get('/tasks'),
    getTasksByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
    createTask: (taskData) => api.post('/tasks', taskData),
    deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
    toggleTask: (taskId) => api.patch(`/tasks/${taskId}/toggle`),

};

export default taskService;