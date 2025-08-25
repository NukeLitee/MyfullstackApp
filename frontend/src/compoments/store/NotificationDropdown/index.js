import React, { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './NotificationDropdown.module.scss';
import { useNotifications } from '../../../context/NotificationContext';

const cx = classNames.bind(styles);

function NotificationDropdown({ onClose }) {
    const { notifications, fetchNotifications } = useNotifications();
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className={cx('wrapper')} ref={dropdownRef}>
            <div className={cx('header')}><h3>Thông báo</h3></div>
            <ul className={cx('notification-list')}>
                {notifications.length > 0 ? (
                    notifications.map(noti => (
                        <li key={noti._id} className={cx('notification-item')}>
                            <div className={cx('avatar')}></div>
                            <div className={cx('content')}>
                                <p>{noti.message}</p>
                                <span className={cx('timestamp')}>{new Date(noti.createdAt).toLocaleString('vi-VN')}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className={cx('notification-item', 'empty')}><p>Không có thông báo mới.</p></li>
                )}
            </ul>
            <div className={cx('footer')}><a href="/notifications">Xem tất cả</a></div>
        </div>
    );
}

export default NotificationDropdown;