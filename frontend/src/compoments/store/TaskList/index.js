import React from 'react';
import classNames from 'classnames/bind';
import { Circle, CheckCircle, Calendar } from 'lucide-react';
import { format, isToday, isPast, parseISO } from 'date-fns';
import vi from 'date-fns/locale/vi';
import styles from './TaskList.module.scss';

const cx = classNames.bind(styles);

// 1. Tách hàm helper ra ngoài component
const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const parsedDate = typeof dueDate === 'string' ? parseISO(dueDate) : new Date(dueDate);

    if (isToday(parsedDate)) {
        return {
            text: `Hôm nay, ${format(parsedDate, 'HH:mm', { locale: vi })}`,
            statusClass: 'today'
        };
    } else if (isPast(parsedDate) && !isToday(parsedDate)) { // Chính xác hơn
        return {
            text: `Quá hạn: ${format(parsedDate, 'dd/MM/yyyy HH:mm', { locale: vi })}`,
            statusClass: 'overdue'
        };
    } else {
        return {
            text: format(parsedDate, 'EEEE, dd/MM/yyyy HH:mm', { locale: vi }),
            statusClass: 'upcoming'
        };
    }
};

function TaskList({ tasks, onDelete, onToggle }) {
    // 2. Thêm điều kiện bảo vệ
    if (!tasks) {
        return null; // Không render gì cả nếu tasks không tồn tại
    }

    return (
        <div className={cx('task-list')}>
            {tasks.map((task) => {
                const dueInfo = formatDueDate(task.dueDate);

                return (
                    <div key={task._id} className={cx('task-item', { completed: task.completed })}>
                        <button
                            className={cx('task-checkbox')}
                            onClick={() => onToggle(task._id)}
                        >
                            {task.completed
                                ? <CheckCircle size={20} className={cx('check-icon', 'completed')} />
                                : <Circle size={20} className={cx('check-icon')} />
                            }
                        </button>

                        <div className={cx('task-content')}>
                            <h5 className={cx('task-title')}>{task.title}</h5>
                            {task.description && (
                                <p className={cx('task-desc')}>{task.description}</p>
                            )}
                            {dueInfo && (
                                <div className={cx('task-details')}>
                                    <span className={cx('due-date', dueInfo.statusClass)}>
                                        <Calendar size={14} className={cx('calendar-icon')} />
                                        {dueInfo.text}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            className={cx('delete-btn')}
                            onClick={() => onDelete(task._id)}
                        >
                            Xóa
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default TaskList;