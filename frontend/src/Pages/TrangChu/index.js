import React, { useState } from 'react';
import classNames from 'classnames/bind';
import Header from '../../compoments/Layout/DefaultLayout/Header';
import Footer from '../../compoments/Layout/DefaultLayout/Footer';
import styles from './FirstPage.module.scss';
import DanhGia from '../../assets/Group 2.png';
import TemplateCard from '../../compoments/store/TemplateCard';

// Import dữ liệu
import templatesData from '../../data/templatesData.js';
import filtersData from '../../data/filtersData.js';

const cx = classNames.bind(styles);

function FirstPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    // Lọc danh sách template dựa trên filter đang được chọn
    const filteredTemplates = activeFilter === 'all'
        ? templatesData
        : templatesData.filter(template => template.category === activeFilter);

    return (
        <div>
            <Header />
            <div className={cx('wrapper')}>
                {/* --- HERO SECTION --- */}
                <div className={cx('wrapper-First', 'hero-bg')}>
                    <div className={cx('wrapper-left')}>
                        <h1>Đơn giản hóa việc làm nhóm</h1>
                        <p>Ngừng tung hứng các công cụ khác nhau. Với TodoList, nhóm của bạn luôn ngăn nắp và bình tĩnh.</p>
                        <img src={DanhGia} alt="Đánh giá từ người dùng" />
                        <button className={cx('bussinessUp')}>Nâng cấp lên TodoList Business</button>
                    </div>
                    <div className={cx('wrapper-right')}></div>
                </div>

                {/* --- STICKY SECTION --- */}
                <div className={cx('sticky-container')}>
                    <div className={cx('scrolling-text')}>
                        <div className={cx('feature-section')}>
                            <p className={cx('pre-heading')}>Yên tâm</p>
                            <h2>Viết ra nhiệm vụ của bạn ngay lập tức</h2>
                            <p className={cx('feature-content')}>Ghi lại và sắp xếp các nhiệm vụ của bạn tức thì bằng ngôn ngữ tự nhiên, trực quan.</p>
                        </div>
                        <div className={cx('feature-section')}>
                            <p className={cx('pre-heading')}>Tập trung vào những gì quan trọng</p>
                            <h2>Luôn ngăn nắp và làm việc hiệu quả</h2>
                            <p className={cx('feature-content')}>Yên tâm bằng cách sắp xếp các nhiệm vụ của bạn trong Hôm nay, Sắp tới hoặc với các bộ lọc tùy chỉnh.</p>
                        </div>
                        <div className={cx('feature-section')}>
                            <p className={cx('pre-heading')}>Yên tâm và lên kế hoạch</p>
                            <h2>Đơn giản hóa lịch trình của bạn</h2>
                            <p className={cx('feature-content')}>Tối ưu hóa thời gian của bạn. Lên lịch thời hạn và dễ dàng thiết lập các nhiệm vụ định kỳ.</p>
                        </div>
                    </div>
                    <div className={cx('sticky-image-wrapper')}>
                        <div className={cx('feature-image')}></div>
                    </div>
                </div>

                {/* --- TEMPLATES SECTION --- */}
                <div className={cx('templates-section')}>
                    <h2>Bắt đầu dự án tiếp theo của bạn với các mẫu của TodoList</h2>
                    <p className={cx('subtitle')}>
                        Không cần tạo dự án hoặc thiết lập từ đầu: chúng tôi có hơn 50 mẫu được tạo sẵn.
                    </p>
                    <div className={cx('filter-buttons')}>
                        {filtersData.map((filter) => (
                            <button
                                key={filter.key}
                                className={cx('filter-btn', { active: activeFilter === filter.key })}
                                onClick={() => setActiveFilter(filter.key)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                    <div className={cx('templates-grid')}>
                        {filteredTemplates.map((template, index) => (
                            <TemplateCard
                                key={index}
                                title={template.title}
                                description={template.description}
                                imageSrc={template.imageSrc}
                            />
                        ))}
                    </div>
                    <a href="#" className={cx('view-more-link')}>
                        Xem thêm mô hình ›
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FirstPage;