import React from 'react';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

//Import hinh anh
import nukeLogo from '../../../../assets/NukeLogo.png';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('info-column')}>
                    <div className={cx('logo')}>
                        <img src={nukeLogo} alt="TodoList Logo" />
                        <p>Todo<span>List</span></p>
                    </div>
                    <p>
                        20 triệu người dùng sắp xếp công việc và cuộc sống hàng ngày của mình bằng Todoist.
                    </p>
                </div>

                <div className={cx('links-column')}>
                    <h4>Đặc trưng</h4>
                    <ul>
                        <li><a href="#">Đặc trưng</a></li>
                        <li><a href="#">Đội</a></li>
                        <li><a href="#">Tỷ giá</a></li>
                        <li><a href="#">Mô hình</a></li>
                    </ul>
                </div>

                <div className={cx('links-column')}>
                    <h4>Tài nguyên</h4>
                    <ul>
                        <li><a href="#">Ứng dụng</a></li>
                        <li><a href="#">Trung tâm trợ giúp</a></li>
                        <li><a href="#">Phương pháp năng suất</a></li>
                        <li><a href="#">Tích hợp</a></li>
                        <li><a href="#">Đối tác kênh</a></li>
                        <li><a href="#">API</a></li>
                        <li><a href="#">Trạng thái</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;