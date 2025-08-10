import React from 'react';
import classNames from 'classnames/bind';
import styles from './Completed.module.scss'; // Sửa tên file import
import TaskList from '../../compoments/store/TaskList';
import { useCompletedTasks } from '../../hooks/useCompletedTasks';

const cx = classNames.bind(styles);

// Sửa tên component thành "Completed"
function Completed() {
    const { tasks, toggleTask, deleteTask } = useCompletedTasks();

    return (
        <main className={cx('wrapper')}>
            <header className={cx('header')}>
                <h1 className={cx('title')}>Đã hoàn thành</h1>
            </header>

            <div className={cx('task-container')}>
                {tasks && tasks.length > 0 ? (
                    <TaskList
                        tasks={tasks}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                ) : (
                    <p className={cx('empty-message')}>Chưa có công việc nào được hoàn thành.</p>
                )}
            </div>
        </main>
    );
}

// Sửa tên export
export default Completed;