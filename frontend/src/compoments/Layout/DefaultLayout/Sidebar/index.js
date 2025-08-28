import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';
import ProfileModal from '../ProfileModal';
import AddProjectModal from '../../../store/AddProjectModal';
import NotificationDropdown from '../../../store/NotificationDropdown';
import { useProjects } from '../../../../hooks/useProjects';
import { useAuth } from '../../../../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faSearch, faInbox, faCalendarDay, faCalendarAlt,
    faFilter, faCheckCircle, faUser, faCog, faChevronDown, faQuestionCircle,
    faBell, faArchive, faHashtag, faBars, faTrash
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Sidebar() {
    // Lấy dữ liệu và các hàm xử lý từ custom hooks
    const { projects, addProject, deleteProject } = useProjects();
    const { user } = useAuth();

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

    // Xử lý khi xóa dự án
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
                            <div className={cx('user-avatar')}>
                                {user && user.avatarUrl ? (
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/${user.avatarUrl.replace(/\\/g, '/')}`}
                                        alt={user.fullName}
                                        className={cx('user-avatar-img')}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUser} />
                                )}
                            </div>
                            <span>{user ? user.fullName : 'Guest'}</span>
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
                            <li className={cx('nav-item')} onClick={() => { /* Logic mở modal add task */ }}>
                                <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
                                <span>Add Task</span>
                            </li>
                            <li><NavLink to="/search" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faSearch} className={cx('icon')} />
                                <span>Search</span>
                            </NavLink></li>
                            <li><NavLink to="/inbox" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faInbox} className={cx('icon')} />
                                <span>Inbox</span>
                            </NavLink></li>
                        </ul>
                        <ul className={cx('nav-list')}>
                            <li><NavLink to="/main" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faCalendarDay} className={cx('icon')} />
                                <span>Today</span>
                            </NavLink></li>
                            <li><NavLink to="/upcomingpage" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faCalendarAlt} className={cx('icon')} />
                                <span>Upcoming</span>
                            </NavLink></li>
                            <li><NavLink to="/completed" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faCheckCircle} className={cx('icon')} />
                                <span>Hoàn thành</span>
                            </NavLink></li>
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
                        <ul className={cx('project-list')}>
                            {projects.map(project => (
                                <li key={project._id} className={cx('project-list-item')}>
                                    <NavLink
                                        to={`/project/${project._id}`}
                                        className={({ isActive }) => cx('project-item-link', { active: isActive })}
                                    >
                                        <FontAwesomeIcon icon={faHashtag} className={cx('icon')} />
                                        <span>{project.name}</span>
                                    </NavLink>
                                    <button className={cx('delete-project-btn')} onClick={(e) => handleDeleteProject(e, project._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
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