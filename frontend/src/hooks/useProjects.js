import { useState, useEffect } from 'react';
import projectService from '../services/projectService';
import api from '../services/api';
export const useProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get('/projects')
            .then(response => setProjects(response.data))
            .catch(error => console.error("Lỗi khi lấy projects:", error));
    }, []);

    const addProject = async (projectData) => {
        try {
            const response = await api.post('/projects', projectData);
            setProjects(prevProjects => [...prevProjects, response.data]);
            return true;
        } catch (error) {
            console.error("Lỗi khi tạo project:", error);
            return false;
        }
    };
    const deleteProject = async (projectId) => {
        try {
            await projectService.deleteProject(projectId);
            setProjects(prevProjects => prevProjects.filter(p => p._id !== projectId));
            return true;
        } catch (error) {
            console.error("Lỗi khi xóa project:", error);
            return false;
        }
    };

    return { projects, addProject, deleteProject };
};