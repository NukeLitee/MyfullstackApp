import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AddProjectModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes, faQuestionCircle, faList, faTableCells,
    faCircle, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

const colors = ['Charcoal', 'Gray', 'Red', 'Orange', 'Yellow', 'Green', 'Teal', 'Blue', 'Purple', 'Magenta'];
const workspaces = ['Dự án của tôi']; // Example workspace

function AddProjectModal({ show, onClose, onAddProject }) {
    const [projectName, setProjectName] = useState('');
    const [selectedColor, setSelectedColor] = useState('Charcoal');
    const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces [0]);
    const [parentProject, setParentProject] = useState('No parent');
    const [isFavorite, setIsFavorite] = useState(false);
    const [layout, setLayout] = useState('list');

    const handleSubmit = () => {
        if (!projectName.trim()) {
            alert('Tên dự án không được để trống');
            return;
        }
        onAddProject({
            name: projectName,
            color: selectedColor,
            workspace: selectedWorkspace,
            parent: parentProject,
            favorite: isFavorite,
            layout,
        });
        onClose();
    };

    if (!show) {
        return null;
    }

    return (
        <div className={cx('modal-overlay')} onClick={onClose}>
            <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={cx('modal-header')}>
                    <h3>Add project <FontAwesomeIcon icon={faQuestionCircle} /></h3>
                    <button className={cx('close-btn')} onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Body */}
                <div className={cx('modal-body')}>
                    <div className={cx('form-group')}>
                        <label htmlFor="project-name">Name</label>
                        <input
                            id="project-name"
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            maxLength="120"
                        />
                        <span className={cx('input-counter')}>{projectName.length}/120</span>
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="project-color">Color</label>
                        <div className={cx('dropdown-wrapper')}>
                            <div className={cx('dropdown-input')} onClick={() => console.log('Open Color Dropdown')}> {/* Implement dropdown logic */}
                                <FontAwesomeIcon icon={faCircle} style={{ color: selectedColor === 'Charcoal' ? '#71717a' : selectedColor.toLowerCase() }} />
                                <span>{selectedColor}</span>
                                <FontAwesomeIcon icon={faChevronDown} className={cx('dropdown-icon')} />
                            </div>
                            {/* Color dropdown will go here */}
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="project-workspace">Workspace</label>
                        <div className={cx('dropdown-wrapper')}>
                            <div className={cx('dropdown-input')} onClick={() => console.log('Open Workspace Dropdown')}> {/* Implement dropdown logic */}
                                <FontAwesomeIcon icon={faUser} />
                                <span>{selectedWorkspace}</span>
                                <FontAwesomeIcon icon={faChevronDown} className={cx('dropdown-icon')} />
                            </div>
                            {/* Workspace dropdown will go here */}
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="parent-project">Parent Project</label>
                        <div className={cx('dropdown-wrapper')}>
                            <div className={cx('dropdown-input')} onClick={() => console.log('Open Parent Project Dropdown')}> {/* Implement dropdown logic */}
                                <span>{parentProject}</span>
                                <FontAwesomeIcon icon={faChevronDown} className={cx('dropdown-icon')} />
                            </div>
                            {/* Parent Project dropdown will go here */}
                        </div>
                    </div>

                    <div className={cx('form-group', 'favorite-toggle')}>
                        <label className={cx('switch')}>
                            <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} />
                            <span className={cx('slider', cx('round'))}></span>
                        </label>
                        <span>Thêm vào mục yêu thích</span>
                    </div>

                    <div className={cx('form-group')}>
                        <label>Bố trí</label>
                        <div className={cx('layout-selector')}>
                            <button
                                className={cx('layout-option', { active: layout === 'list' })}
                                onClick={() => setLayout('list')}
                            >
                                <FontAwesomeIcon icon={faList} />
                                <span>Danh sách</span>
                            </button>
                            <button
                                className={cx('layout-option', { active: layout === 'board' })}
                                onClick={() => setLayout('board')}
                            >
                                <FontAwesomeIcon icon={faTableCells} />
                                <span>Bảng</span>
                            </button>
                        </div>
                    </div>

                    <p className={cx('layout-info')}>Bố cục được đồng bộ hóa giữa các đồng đội trong các dự án được chia sẻ. <a href="#">Tìm hiểu thêm</a></p>
                </div>

                {/* Footer */}
                <div className={cx('modal-footer')}>
                    <button className={cx('cancel-btn')} onClick={onClose}>Hủy</button>
                    <button className={cx('submit-btn')} onClick={handleSubmit}>Thêm</button>
                </div>
            </div>
        </div>
    );
}

export default AddProjectModal;