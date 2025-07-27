import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './LoginPage.module.scss';
import logo from '../../assets/NukeLogo.png'; // Thêm logo của bạn vào
import loginIllustration from '../../assets/login-illustration.png'; // Thêm hình minh họa

const cx = classNames.bind(styles);
const API_URL = 'http://localhost:5000/api/auth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            localStorage.setItem('authToken', response.data.token);
            // Chuyển hướng đến trang chính sau khi đăng nhập thành công
            navigate('/Main');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại.');
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
                    <h1>Đăng nhập</h1>
                    {/* Các nút đăng nhập mạng xã hội (chỉ giao diện) */}
                    <button className={cx('social-btn')}>Tiếp tục với Google</button>
                    <button className={cx('social-btn')}>Tiếp tục với Facebook</button>
                    <button className={cx('social-btn')}>Tiếp tục với Apple</button>

                    <form onSubmit={handleLogin}>
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
                        <button type="submit" className={cx('submit-btn')}>Đăng nhập</button>
                    </form>
                    <a href="#" className={cx('forgot-password')}>Forgot your password?</a>
                    <p className={cx('terms')}>
                        By continuing with Google, Apple, or Email, you agree to Todoist's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </p>
                    <p className={cx('signup-link')}>
                        Don't have an account? <Link to="/RegisterPage">Sign up</Link>
                    </p>
                </div>
                <div className={cx('illustration')}>
                    <img src={loginIllustration} alt="Login Illustration" />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;