import React from 'react';
import { useState } from 'react';
import classNames from 'classnames/bind';
import {
    Circle,
    CheckCircle,
    Calendar,
    MoreHorizontal,
    Trash2
} from 'lucide-react';
import styles from './TaskItem.module.scss';
import { format, isToday, isPast, parseISO } from 'date-fns';

const cx = classNames.bind(styles);

const TaskItem = ({ task, onToggle, onDelete }) => {
    const [showActions, setShowActions] = useState(false);

    // Hàm để định dạng ngày tháng và trả về text/màu tương ứng
    const formatDateInfo = (dateString) => {
        if (!dateString) return null;

        const date = new Date(dateString);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        const dateToCompare = new Date(dateString);
        dateToCompare.setHours(0, 0, 0, 0);

        let dateText = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        let statusClass = 'default';

        if (dateToCompare < today) {
            statusClass = 'overdue';
        } else if (dateToCompare.getTime() === today.getTime()) {
            dateText = 'Today';
            statusClass = 'today';
        }

        return { text: dateText, statusClass: statusClass };
    };

    const dueDateInfo = formatDateInfo(task.dueDate);

    return (
        <div
            className={cx('task-item', { completed: task.completed })}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <button
                className={cx('task-checkbox')}
                onClick={() => onToggle(task._id)}
            >
                {task.completed ? (
                    <CheckCircle size={20} className={cx('check-icon', 'completed')} />
                ) : (
                    <Circle size={20} className={cx('check-icon')} />
                )}
            </button>

            <div className={cx('task-content')}>
                <p className={cx('task-title')}>{task.title}</p>

                {task.description && (
                    <p className={cx('task-description')}>{task.description}</p>
                )}

                {dueDateInfo && (
                    <div className={cx('task-details')}>
            <span className={cx('due-date', dueDateInfo.statusClass)}>
              <Calendar size={14} />
                {dueDateInfo.text}
            </span>
                    </div>
                )}
            </div>

            <div className={cx('task-actions', { visible: showActions })}>
                <button className={cx('action-btn')}><MoreHorizontal size={16} /></button>
                <button className={cx('action-btn')} onClick={() => onDelete(task._id)}><Trash2 size={16} /></button>
            </div>
        </div>
    );
};

export default TaskItem;