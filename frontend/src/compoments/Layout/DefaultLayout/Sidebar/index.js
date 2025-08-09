import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';
import ProfileModal from '../ProfileModal';
import AddProjectModal from '../../../store/AddProjectModal';
import NotificationDropdown from '../../../store/NotificationDropdown'; // Import dropdown mới
import { useProjects } from '../../../../hooks/useProjects';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import icon thùng rác

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faSearch, faInbox, faCalendarDay, faCalendarAlt,
    faFilter, faCheckCircle, faUser, faCog, faChevronDown, faQuestionCircle,
    faBell, faArchive, faHashtag, faBars
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Sidebar() {
    // Lấy dữ liệu và các hàm xử lý từ custom hook
    const { projects, addProject, deleteProject } = useProjects();

    // State quản lý UI của riêng component này
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Xử lý khi một dự án mới được tạo từ modal
    const handleAddProject = async (projectData) => {
        const success = await addProject(projectData);
        if (success) {
            setShowAddProjectModal(false); // Đóng modal nếu thêm thành công
        } else {
            alert("Tạo dự án thất bại!");
        }
    };
    const handleDeleteProject = (e, projectId) => {
        e.preventDefault(); // Ngăn NavLink điều hướng khi nhấn nút xóa
        e.stopPropagation();
        if (window.confirm('Bạn có chắc muốn xóa dự án này và tất cả công việc bên trong?')) {
            deleteProject(projectId);
        }
    };


    return (
        <>
            <aside className={cx('wrapper')}>
                <div className={cx('main-content')}>
                    {/* User Menu */}
                    <div className={cx('user-menu')}>
                        <div className={cx('user-info')} onClick={() => setShowProfileModal(true)}>
                            <FontAwesomeIcon icon={faUser} className={cx('user-avatar')} />
                            <span>Name</span>
                            <FontAwesomeIcon icon={faChevronDown} className={cx('arrow-icon')} />
                        </div>
                        <div className={cx('user-actions')}>
                            <div className={cx('notification-trigger')}>
                                <FontAwesomeIcon
                                    icon={faBell}
                                    onClick={() => setShowNotifications(!showNotifications)}
                                />
                                {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
                            </div>
                            <FontAwesomeIcon icon={faArchive} />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className={cx('navigation')}>
                        <ul className={cx('nav-list')}>
                            <NavLink to="/add-task" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
                                <span>Add Task</span>
                            </NavLink>
                            <NavLink to="/search" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faSearch} className={cx('icon')} />
                                <span>Search</span>
                            </NavLink>
                            <NavLink to="/inbox" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faInbox} className={cx('icon')} />
                                <span>Inbox</span>
                            </NavLink>
                        </ul>
                        <ul className={cx('nav-list')}>
                            <NavLink to="/main" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faCalendarDay} className={cx('icon')} />
                                <span>Today</span>
                            </NavLink>
                            <NavLink to="/upcomingpage" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faCalendarAlt} className={cx('icon')} />
                                <span>Upcoming</span>
                            </NavLink>
                            <NavLink to="/completed" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faCheckCircle} className={cx('icon')} />
                                <span>Hoàn thành</span>
                            </NavLink>
                        </ul>
                    </nav>

                    {/* Projects Section */}
                    <section className={cx('section')}>
                        <div className={cx('section-header')}>
                            <span>Dự án của tôi</span>
                            <div className={cx('section-actions')}>
                                <FontAwesomeIcon icon={faPlus} onClick={() => setShowAddProjectModal(true)} />
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        </div>
                        <ul className={cx('nav-list')}>
                            {projects.map(project => (
                                <NavLink
                                    key={project._id}
                                    to={`/project/${project._id}`}
                                    className={({ isActive }) => cx('nav-item', 'project-item', { active: isActive })}
                                >
                                    <div className={cx('project-info')}>
                                        <span className={cx('project-color-dot')} style={{ backgroundColor: project.color }}></span>
                                        <span>{project.name}</span>
                                    </div>
                                    <button className={cx('delete-project-btn')} onClick={(e) => handleDeleteProject(e, project._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </NavLink>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Help Section */}
                <div className={cx('help-section')}>
                    <FontAwesomeIcon icon={faQuestionCircle} className={cx('icon')} />
                    <span>Trợ giúp và tài nguyên</span>
                </div>
            </aside>

            {/* Render các Modal và Dropdown */}
            <ProfileModal
                show={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
            <AddProjectModal
                show={showAddProjectModal}
                onClose={() => setShowAddProjectModal(false)}
                onAddProject={handleAddProject}
            />
        </>
    );
}

export default Sidebar;