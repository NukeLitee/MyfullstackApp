import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import AddTaskForm from '../../compoments/store/AddTaskForm';
import TaskList from '../../compoments/store/TaskList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faListAlt } from '@fortawesome/free-solid-svg-icons';
import emptyStateImage from './sun-illustration.png';

const cx = classNames.bind(styles);

// Sử dụng biến môi trường thay vì hardcode URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

function TodayView() {
    // === STATE MANAGEMENT ===
    const [showAddTask, setShowAddTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    // === DATA FETCHING ===
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Cập nhật lời gọi API
                const response = await axios.get(`${API_BASE_URL}/api/tasks`);
                setTasks(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    // === EVENT HANDLERS ===
    const handleAddTask = async (taskData) => {
        try {
            // Cập nhật lời gọi API
            const response = await axios.post(`${API_BASE_URL}/api/tasks`, taskData);
            setTasks(prevTasks => [response.data, ...prevTasks]);
            setShowAddTask(false);
        } catch (error) {
            console.error("Lỗi khi tạo task:", error);
            alert("Tạo task thất bại!");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            try {
                // Cập nhật lời gọi API
                await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`);
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            } catch (error) {
                console.error("Lỗi khi xóa task:", error);
                alert("Xóa task thất bại!");
            }
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            // Cập nhật lời gọi API
            const response = await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}/toggle`);
            const updatedTask = response.data;
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? { ...task, completed: updatedTask.completed } : task
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái task:", error);
        }
    };

    // === RENDER LOGIC ===
    return (
        <main className={cx('wrapper')}>
            <header className={cx('header')}>
                <h1 className={cx('title')}>Today</h1>
                <button className={cx('view-switcher')}>
                    <FontAwesomeIcon icon={faListAlt} className={cx('icon')} />
                    <span>Danh sách</span>
                </button>
            </header>

            <TaskList
                tasks={tasks}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
            />

            {showAddTask && (
                <AddTaskForm
                    onAddTask={handleAddTask}
                    onCancel={() => setShowAddTask(false)}
                />
            )}

            {!showAddTask && (
                tasks.length === 0 ? (
                    <div className={cx('empty-state')}>
                        <img src={emptyStateImage} alt="Empty state" className={cx('illustration')} />
                        <h2 className={cx('empty-title')}>Chào mừng bạn đến với chế độ xem Hôm nay</h2>
                        <p className={cx('empty-description')}>Xem mọi thứ đến hạn hôm nay trên tất cả các dự án của bạn.</p>
                        <button className={cx('add-task-btn')} onClick={() => setShowAddTask(true)}>
                            <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
                            <span>Add Task</span>
                        </button>
                    </div>
                ) : (
                    <button className={cx('add-task-inline-btn')} onClick={() => setShowAddTask(true)}>
                        <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
                        <span>Add Task</span>
                    </button>
                )
            )}
        </main>
    );
}

export default TodayView;