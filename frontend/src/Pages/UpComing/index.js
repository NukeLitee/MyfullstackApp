import React from 'react';
import classNames from 'classnames/bind';
import styles from './UpComingPage.module.scss';
import TaskList from '../../compoments/store/TaskList';
import { useUpcomingTasks } from '../../hooks/useUpcomingTasks'; // Import custom hook

const cx = classNames.bind(styles);

function UpcomingPage() {
    // Gọi hook để lấy state và các hàm xử lý
    const { tasks, toggleTask, deleteTask } = useUpcomingTasks();

    return (
        <main className={cx('wrapper')}>
            <header className={cx('header')}>
                <h1 className={cx('title')}>Sắp tới</h1>
            </header>

            <div className={cx('task-container')}>
                {tasks.length > 0 ? (
                    <TaskList
                        tasks={tasks}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                ) : (
                    <p className={cx('empty-message')}>Không có công việc nào sắp tới.</p>
                )}
            </div>
        </main>
    );
}

export default UpcomingPage;