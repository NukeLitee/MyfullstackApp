import api from './api';

const projectService = {
    getAllProjects: () => api.get('/projects'),
    getProjectById: (projectId) => api.get(`/projects/${projectId}`),
    createProject: (projectData) => api.post('/projects', projectData),
};

export default projectService;