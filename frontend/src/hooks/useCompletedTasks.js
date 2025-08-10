// src/hooks/useCompletedTasks.js
import { useState, useEffect } from 'react';
import taskService from '../services/taskService';

export const useCompletedTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        taskService.getCompletedTasks()
            .then(response => setTasks(response.data))
            .catch(error => console.error("Lỗi khi lấy tasks đã hoàn thành:", error));
    }, []);

    // Khi "hoàn tác", task sẽ biến mất khỏi danh sách này
    const toggleTask = async (taskId) => {
        try {
            await taskService.toggleTask(taskId);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
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