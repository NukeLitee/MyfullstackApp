import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './RegisterPage.module.scss';
import logo from '../../assets/NukeLogo.png';
import loginIllustration from '../../assets/login-illustration.png';

const cx = classNames.bind(styles);
const API_URL = 'http://localhost:5000/api/auth';

function RegisterPage() {
    // Thêm state cho fullName
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        try {
            // Gọi API đăng ký
            const response = await axios.post(`${API_URL}/register`, { fullName, email, password });
            setSuccess(response.data.message + ' Bạn sẽ được chuyển đến trang đăng nhập...');

            // Chuyển hướng đến trang đăng nhập sau 2 giây
            setTimeout(() => {
                navigate('/loginPage');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Link to="/" className={cx('back-link')}>←</Link>
                <img src={logo} alt="TodoList Logo" className={cx('logo')} />
            </header>
            <div className={cx('main-content')}>
                <div className={cx('login-form')}>
                    <h1>Tạo tài khoản</h1>

                    <form onSubmit={handleRegister}>
                        {/* Thêm trường Họ và tên */}
                        <div className={cx('form-group')}>
                            <label htmlFor="fullName">Họ và tên</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name..."
                                required
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter the email..."
                                required
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter the password..."
                                required
                            />
                        </div>

                        {error && <p className={cx('error-message')}>{error}</p>}
                        {success && <p className={cx('success-message')}>{success}</p>}

                        {/* Thay đổi text của nút */}
                        <button type="submit" className={cx('submit-btn')}>Đăng ký</button>
                    </form>

                    <p className={cx('signup-link')}>
                        {/* Thay đổi link ở cuối */}
                        Already have an account? <Link to="/loginPage">Log in</Link>
                    </p>
                </div>
                <div className={cx('illustration')}>
                    <img src={loginIllustration} alt="Illustration" />
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;