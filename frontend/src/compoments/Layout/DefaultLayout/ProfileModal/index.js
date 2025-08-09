import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ProfileModal.module.scss';
import api from '../../../../services/api';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ProfileModal({ show, onClose }) {
    // State quản lý dữ liệu và UI
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // 2. Khởi tạo hook navigate

    // useEffect để lấy dữ liệu và kích hoạt animation
    useEffect(() => {
        if (show) {
            const mountTimer = setTimeout(() => setIsAnimating(true), 10);

            setIsLoading(true);
            api.get('/users/me')
                .then(response => {
                    const userData = response.data;
                    setUser(userData);
                    setName(userData.fullName);
                    setEmail(userData.email);
                    if (userData.avatarUrl) {
                        setPreview(`http://localhost:5000/${userData.avatarUrl.replace(/\\/g, '/')}`);
                    } else {
                        setPreview(null);
                    }
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Lỗi khi lấy thông tin user:", error);
                    setIsLoading(false);
                });

            return () => clearTimeout(mountTimer);
        }
    }, [show]);

    // Hàm đóng có xử lý exit animation
    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300); // Thời gian phải khớp với transition-duration trong SCSS
    };

    // Xử lý khi người dùng chọn một file ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Xử lý việc tải ảnh đại diện lên server
    const handleAvatarUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        try {
            const response = await api.post('/users/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(response.data);
            alert('Cập nhật ảnh đại diện thành công!');
        } catch (error) {
            alert('Cập nhật ảnh thất bại!');
        }
    };
    const handleLogout = () => {
        // Xóa token đã lưu trong localStorage
        localStorage.removeItem('authToken');
        // Điều hướng người dùng về trang đăng nhập
        navigate('/loginpage');
    };

    if (!show) {
        return null;
    }
    // Xử lý việc cập nhật tên/email
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/me', { fullName: name, email });
            setUser(response.data);
            alert('Cập nhật thông tin thành công!');
            handleClose(); // Đóng modal sau khi thành công
        } catch (error) {
            alert('Cập nhật thông tin thất bại!');
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div
            className={cx('modal-overlay', { active: isAnimating })}
            onClick={handleClose}
        >
            <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                <header className={cx('modal-header')}>
                    <h1>Tài khoản</h1>
                    <button className={cx('close-btn')} onClick={handleClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </header>
                <div className={cx('modal-body')}>
                    {isLoading ? (
                        <p>Đang tải...</p>
                    ) : (
                        <form onSubmit={handleProfileUpdate}>
                            <section className={cx('profile-section')}>
                                <label>Hình ảnh</label>
                                <div className={cx('avatar-section')}>
                                    <div className={cx('avatar-placeholder')}>
                                        {preview ? <img src={preview} alt="Avatar Preview" className={cx('avatar-preview')} /> : <FontAwesomeIcon icon={faUser} />}
                                    </div>
                                    <div className={cx('avatar-actions')}>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                                        <button
                                            type="button"
                                            className={cx('action-btn')}
                                            onClick={() => fileInputRef.current.click()}
                                        >Tải lên ảnh</button>
                                        {selectedFile && <button type="button" className={cx('action-btn', 'upload-btn')} onClick={handleAvatarUpload}>Lưu ảnh</button>}
                                        <p>Chọn một bức ảnh có kích thước tối đa 4MB.</p>
                                    </div>
                                </div>
                            </section>
                            <section className={cx('profile-section')}>
                                <label htmlFor="name-input">Tên</label>
                                <div className={cx('input-wrapper')}>
                                    <input id="name-input" type="text" value={name} onChange={e => setName(e.target.value)} className={cx('input-field')} />
                                </div>
                            </section>
                            <section className={cx('profile-section')}>
                                <label htmlFor="email-input">Email</label>
                                <div className={cx('input-wrapper')}>
                                    <input id="email-input" type="email" value={email} onChange={e => setEmail(e.target.value)} className={cx('input-field')} />
                                </div>
                            </section>
                            <div className={cx('modal-footer')}>
                                <button type="button" className={cx('logout-btn')} onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                                <button type="button" className={cx('cancel-btn')} onClick={handleClose}>Hủy</button>
                                <button type="submit" className={cx('submit-btn')}>Lưu thay đổi</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;