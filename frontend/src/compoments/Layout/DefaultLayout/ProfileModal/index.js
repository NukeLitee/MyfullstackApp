import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProfileModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ProfileModal({ show, onClose }) {
    if (!show) {
        return null;
    }

    return (
        <div className={cx('modal-overlay')} onClick={onClose}>
            <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('modal-header')}>
                    <h4>Cài đặt</h4>
                    <button className={cx('close-button')} onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className={cx('modal-body')}>
                    <nav className={cx('settings-nav')}>
                        <ul>
                            <li className={cx('active')}>Tài khoản</li>
                            <li>Tổng quát</li>
                            {/* ... các mục cài đặt khác ... */}
                        </ul>
                    </nav>

                    <main className={cx('settings-content')}>
                        <h5>Tài khoản</h5>
                        <div className={cx('profile-section')}>
                            <p>Hình ảnh</p>
                            <div className={cx('avatar-uploader')}>
                                <FontAwesomeIcon icon={faUserCircle} className={cx('avatar-icon')} />
                                <div className={cx('avatar-text')}>
                                    <button>Tải lên ảnh</button>
                                    <span>Chọn một bức ảnh có kích thước tối đa 4MB...</span>
                                </div>
                            </div>
                        </div>
                        <div className={cx('profile-section')}>
                            <label htmlFor="name">Tên</label>
                            <input type="text" id="name" defaultValue="name" />
                            <span>4/250</span>
                        </div>
                        <div className={cx('profile-section')}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value="nguyenvanA@gmail.com" disabled />
                            <button className={cx('change-btn')}>Đổi email</button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;