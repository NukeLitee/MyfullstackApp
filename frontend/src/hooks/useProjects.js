import { useState, useEffect } from 'react';
import projectService from '../services/projectService'; // Import service

export const useProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // ✅ SỬA LẠI: Gọi qua projectService thay vì api client trực tiếp
        projectService.getAllProjects()
            .then(response => setProjects(response.data))
            .catch(error => console.error("Lỗi khi lấy projects:", error));
    }, []);

    const addProject = async (projectData) => {
        try {
            // ✅ SỬA LẠI: Gọi qua projectService
            const response = await projectService.createProject(projectData);
            setProjects(prevProjects => [...prevProjects, response.data]);
            return true;
        } catch (error) {
            console.error("Lỗi khi tạo project:", error);
            return false;
        }
    };

    const deleteProject = async (projectId) => {
        try {
            // Dòng này đã đúng vì nó đang dùng projectService
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