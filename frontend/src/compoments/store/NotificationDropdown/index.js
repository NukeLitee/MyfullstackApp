import React, { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './NotificationDropdown.module.scss';

const cx = classNames.bind(styles);

// Dữ liệu mẫu
const notifications = [
    { id: 1, user: 'Sơn Đặng', action: 'đã thêm bạn vào dự án "Thiết kế Web"', time: '5 phút trước' },
    { id: 2, user: 'Thanh Trúc', action: 'đã hoàn thành công việc "Báo cáo tuần"', time: '1 giờ trước' },
    { id: 3, user: 'Đức Long', action: 'đã bình luận về công việc "Sửa lỗi API"', time: '3 giờ trước' },
];

function NotificationDropdown({ onClose }) {
    const dropdownRef = useRef(null);

    // Logic để đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className={cx('wrapper')} ref={dropdownRef}>
            <div className={cx('header')}>
                <h3>Thông báo</h3>
            </div>
            <ul className={cx('notification-list')}>
                {notifications.map(noti => (
                    <li key={noti.id} className={cx('notification-item')}>
                        <div className={cx('avatar')}></div>
                        <div className={cx('content')}>
                            <p>
                                <strong>{noti.user}</strong> {noti.action}
                            </p>
                            <span className={cx('timestamp')}>{noti.time}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={cx('footer')}>
                <a href="/notifications">Xem tất cả thông báo</a>
            </div>
        </div>
    );
}

export default NotificationDropdown;