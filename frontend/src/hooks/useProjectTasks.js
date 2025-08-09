import { useState, useEffect, useCallback } from 'react';
// Import service, KHÔNG import api trực tiếp
import taskService from '../services/taskService';
import api from '../services/api'; // Vẫn cần cho project details

export const useProjectTasks = (projectId) => {
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);

    const fetchProjectData = useCallback(async () => {
        if (!projectId) return;
        try {
            // Lấy project details vẫn dùng api client vì ta chưa tạo projectService
            const projectResponse = await api.get(`/projects/${projectId}`);
            setProject(projectResponse.data);

            // ✅ SỬA LẠI Ở ĐÂY: Gọi hàm từ service để lấy tasks
            const tasksResponse = await taskService.getTasksByProject(projectId);
            setTasks(tasksResponse.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu dự án:", error);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    // Các hàm khác cũng nên dùng service
    const addTask = async (taskData) => {
        try {
            const response = await taskService.createTask({ ...taskData, projectId });
            setTasks(prevTasks => [response.data, ...prevTasks]);
            return true;
        } catch (error) {
            console.error("Lỗi khi tạo task:", error);
            return false;
        }
    };

    // ... deleteTask, toggleTask tương tự ...

    return { project, tasks, addTask, deleteTask, toggleTask };
};