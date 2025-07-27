import React, { useState, forwardRef } from 'react';
import classNames from 'classnames/bind';
import DatePicker from "react-datepicker";
import styles from './AddTaskForm.module.scss';
import "react-datepicker/dist/react-datepicker.css"; // CSS cho DatePicker
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendar, faFlag, faBell, faEllipsisH, faInbox,
    faUser, faCog, faHashtag,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

// Dữ liệu cho các mức độ ưu tiên
const priorities = [
    { level: 1, color: '#de4c4a', text: 'Ưu tiên 1' },
    { level: 2, color: '#f49c18', text: 'Ưu tiên 2' },
    { level: 3, color: '#4073d6', text: 'Ưu tiên 3' },
    { level: 4, color: '#808080', text: 'Ưu tiên 4' },
];

function AddTaskForm({ onAddTask, onCancel }) {
    // State cho dữ liệu form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [dueDate, setDueDate] = useState(new Date());

    // State điều khiển UI
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

    // Xử lý khi gửi form
    const handleSubmit = () => {
        if (!title.trim()) {
            alert('Vui lòng nhập tiêu đề công việc!');
            return;
        }
        onAddTask({ title, description, priority: selectedPriority, dueDate });

        // Reset các state sau khi thêm
        setTitle('');
        setDescription('');
        setSelectedPriority(null);
        setDueDate(new Date());
    };

    // Xử lý khi chọn một độ ưu tiên
    const handleSelectPriority = (priority) => {
        setSelectedPriority(priority);
        setShowPriorityDropdown(false);
    };

    // Component custom cho input của DatePicker để giữ style
    const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
        <button className={cx('meta-btn')} onClick={onClick} ref={ref}>
            <FontAwesomeIcon icon={faCalendar} className={cx('icon')} />
            <span>{value}</span>
        </button>
    ));

    return (
        <div className={cx('wrapper')}>
            {/* Khu vực nhập liệu chính */}
            <div className={cx('editor')}>
                <input
                    className={cx('input-title')}
                    type="text"
                    placeholder="Tiêu đề"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    className={cx('input-description')}
                    type="text"
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Khu vực các nút metadata */}
            <div className={cx('metadata')}>
                <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    customInput={<CustomDateInput />}
                    showTimeSelect
                    dateFormat="d MMM, yyyy h:mm aa"
                />

                <div className={cx('priority-selector')}>
                    <button
                        className={cx('meta-btn')}
                        onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    >
                        <FontAwesomeIcon
                            icon={faFlag}
                            className={cx('icon')}
                            style={{ color: selectedPriority ? selectedPriority.color : '#6b7280' }}
                        />
                        {selectedPriority && <span>{selectedPriority.text}</span>}
                    </button>
                    {showPriorityDropdown && (
                        <div className={cx('priority-dropdown')}>
                            <ul>
                                {priorities.map((p) => (
                                    <li key={p.level} onClick={() => handleSelectPriority(p)}>
                                        <FontAwesomeIcon icon={faFlag} style={{ color: p.color }} />
                                        <span>{p.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button className={cx('meta-btn')}>
                    <FontAwesomeIcon icon={faBell} className={cx('icon')} />
                    <span>Nhắc nhở</span>
                </button>
                <button className={cx('meta-btn', 'more-btn')}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </button>
            </div>

            {/* Khu vực hành động */}
            <div className={cx('actions')}>
                <div className={cx('project-selector-wrapper')}>
                    <button
                        className={cx('project-selector')}
                        onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                    >
                        <FontAwesomeIcon icon={faInbox} className={cx('icon')} />
                        <span>Hộp thư đến</span>
                    </button>
                    {showProjectDropdown && (
                        <div className={cx('project-dropdown')}>
                            <input type="text" placeholder="Nhập tên dự án" className={cx('search-project')} />
                            <ul className={cx('project-list')}>
                                <li className={cx('project-item', 'selected')}>
                                    <FontAwesomeIcon icon={faInbox} className={cx('icon')} />
                                    <span>Hộp thư đến</span>
                                </li>
                                <li className={cx('project-category')}>
                                    <FontAwesomeIcon icon={faUser} className={cx('icon')} />
                                    <span>Dự án của tôi</span>
                                </li>
                                <li className={cx('project-item', 'sub-item')}>
                                    <FontAwesomeIcon icon={faHashtag} className={cx('icon')} />
                                    <span>Bắt đầu</span>
                                </li>
                                <li className={cx('project-category')}>
                                    <FontAwesomeIcon icon={faCog} className={cx('icon')} />
                                    <span>Nhóm</span>
                                </li>
                                <li className={cx('project-item', 'sub-item')}>
                                    <FontAwesomeIcon icon={faHashtag} className={cx('icon')} />
                                    <span>Thiết lập nhóm của bạn</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className={cx('action-buttons')}>
                    <button className={cx('cancel-btn')} onClick={onCancel}>Hủy</button>
                    <button className={cx('submit-btn')} onClick={handleSubmit}>Thêm nhiệm vụ</button>
                </div>
            </div>
        </div>
    );
}

export default AddTaskForm;