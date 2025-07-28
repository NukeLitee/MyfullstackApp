import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';

import styles from './Completed.module.scss';
import TaskList from '../../compoments/store/TaskList';

const cx = classNames.bind(styles);
const API_BASE_URL = process.env.REACT_APP_API_URL;

function Completed() {
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/completed`);
                setCompletedTasks(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tasks đã hoàn thành:", error);
            }
        };
        fetchCompletedTasks();
    }, []);

    const handleToggleTask = async (taskId) => {
        // Logic này sẽ "hoàn tác" một task, chuyển nó về chưa hoàn thành
        try {
            await axios.patch(`${API_BASE_URL}/${taskId}/toggle`);
            // Xóa task khỏi danh sách đã hoàn thành trên UI
            setCompletedTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${taskId}`);
            setCompletedTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Lỗi khi xóa task:', error);
        }
    };

    return (
        <main className={cx('wrapper')}>
            <header className={cx('header')}>
                <h1 className={cx('title')}>Đã hoàn thành</h1>
            </header>

            <div className={cx('task-container')}>
                <TaskList
                    tasks={completedTasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                />
            </div>
        </main>
    );
}

export default Completed;