import React from 'react';
import classNames from 'classnames/bind';
import styles from './TemplateCard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

// 1. Nhận thêm prop `imageSrc`
function TemplateCard({ title, description, imageSrc, type = 'Danh sách' }) {
    return (
        <div className={cx('template-card')}>
            <div className={cx('card-illustration')}>
                {/* 2. Sử dụng prop `imageSrc` cho thẻ img */}
                <img src={imageSrc} alt={title} />
            </div>

            <div className={cx('card-content')}>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className={cx('card-footer')}>
                    <FontAwesomeIcon icon={faListAlt} />
                    <span>{type}</span>
                </div>
            </div>
        </div>
    );
}

export default TemplateCard;