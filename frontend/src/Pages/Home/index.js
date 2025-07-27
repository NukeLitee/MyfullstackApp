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

// Thay thế bằng URL backend của bạn
const API_URL = 'http://localhost:5000/api/tasks';

function TodayView() {
    // === STATE MANAGEMENT ===
    const [showAddTask, setShowAddTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    // === DATA FETCHING ===
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(API_URL);
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
            const response = await axios.post(API_URL, taskData);
            const newTask = response.data;
            setTasks(prevTasks => [newTask, ...prevTasks]);
            setShowAddTask(false);
        } catch (error) {
            console.error("Lỗi khi tạo task:", error);
            alert("Tạo task thất bại!");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            try {
                await axios.delete(`${API_URL}/${taskId}`);
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            } catch (error) {
                console.error("Lỗi khi xóa task:", error);
                alert("Xóa task thất bại!");
            }
        }
    };

    // THÊM HÀM MỚI: Xử lý bật/tắt trạng thái hoàn thành
    const handleToggleTask = async (taskId) => {
        try {
            const response = await axios.patch(`${API_URL}/${taskId}/toggle`);
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

            {/* CẬP NHẬT: Truyền thêm prop onToggle vào TaskList */}
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