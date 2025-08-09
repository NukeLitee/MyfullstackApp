import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import AddTaskForm from '../../compoments/store/AddTaskForm';
import TaskList from '../../compoments/store/TaskList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faListAlt } from '@fortawesome/free-solid-svg-icons';
import emptyStateImage from './sun-illustration.png';
import { useTasks } from '../../hooks/useTasks'; // Import custom hook



const cx = classNames.bind(styles);

function TodayView() {
    // Gọi hook để lấy state và các hàm xử lý
    const { tasks, addTask, deleteTask, toggleTask } = useTasks();
    const [showAddTask, setShowAddTask] = useState(false);

    const handleAddTask = async (taskData) => {
        const success = await addTask(taskData);
        if (success) {
            setShowAddTask(false); // Chỉ đóng form khi thêm thành công
        } else {
            alert("Tạo task thất bại!");
        }
    };

    // handleDeleteTask và handleToggleTask sẽ được truyền thẳng xuống
    // mà không cần định nghĩa lại ở đây.

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
                onDelete={deleteTask}
                onToggle={toggleTask}
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