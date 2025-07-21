import React, { useState, useEffect } from 'react'; // THÊM VÀO: useEffect
import axios from 'axios'; // THÊM VÀO: axios để gọi API
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import AddTaskForm from '../../compoments/store/AddTaskForm';
import TaskList from '../../compoments/store/TaskList'; // THÊM VÀO: Import TaskList
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
    }, []); // Mảng rỗng `[]` đảm bảo useEffect chỉ chạy 1 lần

    // === EVENT HANDLERS ===
    const handleAddTask = async (taskData) => {
        try {
            const response = await axios.post(API_URL, taskData);
            const newTask = response.data;
            setTasks(prevTasks => [newTask, ...prevTasks]); // Thêm task mới vào đầu danh sách
            setShowAddTask(false); // Ẩn form
        } catch (error) {
            console.error("Lỗi khi tạo task:", error);
            alert("Tạo task thất bại!");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            try {
                await axios.delete(`${API_URL}/${taskId}`);
                // Lọc bỏ task đã xóa khỏi danh sách trên UI
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            } catch (error) {
                console.error("Lỗi khi xóa task:", error);
                alert("Xóa task thất bại!");
            }
        }
    };

    // === RENDER LOGIC ===
    return (
        <main className={cx('wrapper')}>
            {/* Header */}
            <header className={cx('header')}>
                <h1 className={cx('title')}>Today</h1>
                <button className={cx('view-switcher')}>
                    <FontAwesomeIcon icon={faListAlt} className={cx('icon')} />
                    <span>Danh sách</span>
                </button>
            </header>

            {/* Hiển thị danh sách task nếu có */}
            {tasks.length > 0 && <TaskList tasks={tasks} onDelete={handleDeleteTask} />}

            {/* Hiển thị form thêm task nếu được kích hoạt */}
            {showAddTask && (
                <AddTaskForm
                    onAddTask={handleAddTask}
                    onCancel={() => setShowAddTask(false)}
                />
            )}

            {/* Hiển thị Empty State hoặc nút Add Task inline */}
            {!showAddTask && (
                tasks.length === 0 ? (
                    // Hiển thị khi không có task nào
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
                    // Hiển thị nút "Add Task" khi đã có danh sách
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