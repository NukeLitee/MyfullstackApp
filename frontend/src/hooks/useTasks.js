import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { useNotifications } from '../context/NotificationContext';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const { fetchNotifications } = useNotifications();

    useEffect(() => {
        taskService.getAllTasks()
            .then(response => setTasks(response.data))
            .catch(error => console.error("Lỗi khi lấy tasks:", error));
    }, []);

    const addTask = async (taskData) => {
        try {
            const response = await taskService.createTask(taskData);
            setTasks(prevTasks => [response.data, ...prevTasks]);
            fetchNotifications();
            return true; // Báo hiệu thành công
        } catch (error) {
            console.error("Lỗi khi tạo task:", error);
            return false; // Báo hiệu thất bại
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            fetchNotifications();
        } catch (error) {
            console.error("Lỗi khi xóa task:", error);
        }
    };

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

    return { tasks, addTask, deleteTask, toggleTask };
};