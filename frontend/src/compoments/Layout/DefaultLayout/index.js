import Header from './Header';
import Sidebar from './Sidebar';
import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    // Chỉ cần một thẻ div bao ngoài
    return (
        <div className={cx('wrapper')}>
            <Sidebar />
            <main className={cx('content')}>{children}</main>
        </div>
    );
}

export default DefaultLayout;