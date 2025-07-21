// TaskList.jsx
import React from 'react';
import styles from './TaskList.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

// Cập nhật: Component giờ sẽ nhận thêm prop onDelete
function TaskList({ tasks, onDelete }) {
    return (
        <div className={cx('task-list')}>
            {tasks.map((task) => (
                <div key={task._id} className={cx('task-item')}>
                    <div className={cx('task-content')}>
                        <h5 className={cx('task-title')}>{task.title}</h5>
                        {task.description && <p className={cx('task-desc')}>{task.description}</p>}
                    </div>
                    {/* THÊM NÚT XÓA */}
                    <button
                        className={cx('delete-btn')}
                        onClick={() => onDelete(task._id)}
                    >
                        Xóa
                    </button>
                </div>
            ))}
        </div>
    );
}

export default TaskList;