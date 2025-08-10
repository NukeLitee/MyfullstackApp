// src/hooks/useUpcomingTasks.js
import { useState, useEffect } from 'react';
import taskService from '../services/taskService';

export const useUpcomingTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        taskService.getUpcomingTasks()
            .then(response => setTasks(response.data))
            .catch(error => console.error("Lỗi khi lấy tasks sắp tới:", error));
    }, []);

    const toggleTask = async (taskId) => {
        try {
            const response = await taskService.toggleTask(taskId);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? response.data : task
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật task:", error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error("Lỗi khi xóa task:", error);
        }
    };

    return { tasks, toggleTask, deleteTask };
};