import styles from './Header.module.scss';
import nukeLogo from './NukeLogo.png';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

// 1. Import thêm các icon cần thiết
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheckCircle,faUsersBetweenLines, faListAlt, faClock, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <img src={nukeLogo} alt="Logo" />
                    <p>
                        Todo<span>List</span>
                    </p>
                </div>
                <div className={cx('headerRight')}>
                    <div className={cx('headerDropdown')}>
                        <ul className={cx('list')}>
                            <li className={cx('list-item')}>
                                <span>Mục Tiêu</span>
                                <FontAwesomeIcon className={cx('arrow-icon')} icon={faChevronDown} />

                                {/* 2. Thay thế nội dung dropdown cũ bằng menu mới có icon */}
                                <ul className={cx('dropdown-menu')}>
                                    <li className={cx('menu-item')}>
                                        <FontAwesomeIcon icon={faCheckCircle} className={cx('icon')} />
                                        <span>Quản lý công việc</span>
                                    </li>
                                    <li className={cx('menu-item')}>
                                        <FontAwesomeIcon icon={faListAlt} className={cx('icon')} />
                                        <span>Quản lý dự án</span>
                                    </li>
                                    <li className={cx('menu-item')}>
                                        <FontAwesomeIcon icon={faClock} className={cx('icon')} />
                                        <span>Quản lý thời gian</span>
                                    </li>
                                </ul>
                            </li>

                            <li className={cx('list-item')}>
                                <span>Tài Nguyên</span>
                                <FontAwesomeIcon className={cx('arrow-icon')} icon={faChevronDown} />
                                {/* Bạn có thể thêm menu tương tự vào đây */}
                                <ul className={cx('dropdown-menu')}>
                                    <li className={cx('menu-item')}>
                                        <FontAwesomeIcon icon={faChartLine} className={cx('icon')} />
                                        <span>Xây dựng thói quen</span>
                                    </li>
                                    <li className={cx('menu-item')}>
                                        <FontAwesomeIcon icon={faUsers} className={cx('icon')} />
                                        <span>Làm việc theo nhóm</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <span className={cx('lineBetween')}></span>
                    <div className={cx('headerButton')}>
                        <Link to="/LoginPage">
                            <button className={cx('LoginButton')}>Đăng Nhập</button>
                        </Link>
                        {/* 3. Bọc nút Đăng Ký trong thẻ Link */}
                        <Link to="/RegisterPage">
                            <button className={cx('SignInButton')}>Đăng Ký</button>
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
}
export default Header;