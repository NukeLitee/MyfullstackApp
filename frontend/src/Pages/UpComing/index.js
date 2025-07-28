import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './UpComingPage.module.scss';
import TaskList from '../../compoments/store/TaskList';

const cx = classNames.bind(styles);

// Sử dụng biến môi trường thay vì hardcode URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

function UpcomingPage() {
    const [upcomingTasks, setUpcomingTasks] = useState([]);

    useEffect(() => {
        const fetchUpcomingTasks = async () => {
            try {
                // Cập nhật lời gọi API
                const response = await axios.get(`${API_BASE_URL}/api/tasks/upcoming`);
                setUpcomingTasks(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tasks sắp tới:", error);
            }
        };
        fetchUpcomingTasks();
    }, []);

    const handleToggleTask = async (taskId) => {
        try {
            // Cập nhật lời gọi API
            const response = await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}/toggle`);
            const updatedTask = response.data;
            setUpcomingTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? { ...task, completed: updatedTask.completed } : task
                )
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            // Cập nhật lời gọi API
            await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`);
            setUpcomingTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Lỗi khi xóa task:', error);
        }
    };

    return (
        <main className={cx('wrapper')}>
            <header className={cx('header')}>
                <h1 className={cx('title')}>Sắp tới</h1>
            </header>

            <div className={cx('task-container')}>
                {upcomingTasks.length > 0 ? (
                    <TaskList
                        tasks={upcomingTasks}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                    />
                ) : (
                    <p className={cx('empty-message')}>Không có công việc nào sắp tới.</p>
                )}
            </div>
        </main>
    );
}

export default UpcomingPage;