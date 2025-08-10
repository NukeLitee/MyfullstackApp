import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProfileModal.module.scss';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ProfileModal({ show, onClose }) {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (show) {
            if (user) {
                setName(user.fullName);
                setEmail(user.email);
                if (user.avatarUrl) {
                    setPreview(`${process.env.REACT_APP_API_URL}/${user.avatarUrl.replace(/\\/g, '/')}`);
                } else {
                    setPreview(null);
                }
            }
            const mountTimer = setTimeout(() => setIsAnimating(true), 10);
            return () => clearTimeout(mountTimer);
        }
    }, [show, user]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
            if (user && user.avatarUrl) {
                setPreview(`${process.env.REACT_APP_API_URL}/${user.avatarUrl.replace(/\\/g, '/')}`);
            } else {
                setPreview(null);
            }
            setSelectedFile(null);
        }, 300);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        try {
            const response = await api.post('/users/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            updateUser(response.data);
            alert('Cập nhật ảnh đại diện thành công!');
            setSelectedFile(null);
        } catch (error) {
            alert('Cập nhật ảnh thất bại!');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/me', { fullName: name, email });
            updateUser(response.data);
            alert('Cập nhật thông tin thành công!');
            handleClose();
        } catch (error) {
            alert('Cập nhật thông tin thất bại!');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/loginpage');
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
                    {!user ? (
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
                                        <button type="button" className={cx('action-btn')} onClick={() => fileInputRef.current.click()}>Tải lên ảnh</button>
                                        {selectedFile && <button type="button" className={cx('action-btn', 'upload-btn')} onClick={handleAvatarUpload}>Lưu ảnh</button>}
                                        <p>Chọn một bức ảnh có kích thước tối đa 4MB.</p>
                                    </div>
                                </div>
                            </section>
                            <section className={cx('profile-section')}>
                                <label htmlFor="name-input">Tên</label>
                                <input id="name-input" type="text" value={name} onChange={e => setName(e.target.value)} className={cx('input-field')} />
                            </section>
                            <section className={cx('profile-section')}>
                                <label htmlFor="email-input">Email</label>
                                <input id="email-input" type="email" value={email} onChange={e => setEmail(e.target.value)} className={cx('input-field')} />
                            </section>
                            <div className={cx('modal-footer')}>
                                <button type="button" className={cx('logout-btn')} onClick={handleLogout}>Đăng xuất</button>
                                <div className={cx('main-actions')}>
                                    <button type="button" className={cx('cancel-btn')} onClick={handleClose}>Hủy</button>
                                    <button type="submit" className={cx('submit-btn')}>Lưu thay đổi</button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;