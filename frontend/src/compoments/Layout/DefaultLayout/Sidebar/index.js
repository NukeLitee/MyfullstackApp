import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import axios from 'axios';

// Import các component con và file style
import styles from './Sidebar.module.scss';
import ProfileModal from '../ProfileModal';
import AddProjectModal from './../../../store/AddProjectModal';

// Import icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faSearch, faInbox, faCalendarDay, faCalendarAlt,
    faFilter, faCheckCircle, faUser, faCog, faChevronDown, faQuestionCircle,
    faBell, faArchive, faHashtag, faBars
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

// URL API cho projects
const API_BASE_URL = process.env.REACT_APP_API_URL;

function Sidebar() {
    // === STATE MANAGEMENT ===
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [projects, setProjects] = useState([]);

    // === DATA FETCHING ===
    // Lấy danh sách dự án khi component được tải lần đầu
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Giả sử token được lưu trong localStorage sau khi đăng nhập
                const token = localStorage.getItem('authToken');
                const response = await axios.get(API_BASE_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dự án:", error);
            }
        };
        fetchProjects();
    }, []); // Mảng rỗng `[]` để useEffect chỉ chạy 1 lần

    // === EVENT HANDLERS ===
    // Xử lý khi một dự án mới được tạo
    const handleAddProject = async (projectData) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(API_BASE_URL, projectData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newProject = response.data;
            // Cập nhật lại danh sách dự án trên UI
            setProjects(prevProjects => [...prevProjects, newProject]);
        } catch (error) {
            console.error("Lỗi khi tạo dự án:", error);
            alert("Tạo dự án thất bại!");
        }
    };

    // === RENDER LOGIC ===
    return (
        <>
            <aside className={cx('wrapper')}>
                <div className={cx('main-content')}>
                    {/* User Menu */}
                    <div className={cx('user-menu')} onClick={() => setShowProfileModal(true)}>
                        <div className={cx('user-info')}>
                            <FontAwesomeIcon icon={faUser} className={cx('user-avatar')} />
                            <span>Name</span>
                            <FontAwesomeIcon icon={faChevronDown} className={cx('arrow-icon')} />
                        </div>
                        <div className={cx('user-actions')}>
                            <FontAwesomeIcon icon={faBell} />
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
                            <NavLink to="/Main" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faCalendarDay} className={cx('icon')} />
                                <span>Today</span>
                            </NavLink>
                            <NavLink to="/upcomingpage" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faCalendarAlt} className={cx('icon')} />
                                <span>Upcoming</span>
                            </NavLink>
                            <NavLink to="/filters-labels" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                                <FontAwesomeIcon icon={faFilter} className={cx('icon')} />
                                <span>Bộ lọc và nhãn</span>
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
                            {/* Render danh sách dự án động */}
                            {projects.map(project => (
                                <NavLink
                                    key={project._id}
                                    to={`/project/${project._id}`}
                                    className={({ isActive }) => cx('nav-item', 'project-item', { active: isActive })}
                                >
                                    <span className={cx('project-color-dot')} style={{ backgroundColor: project.color }}></span>
                                    <span>{project.name}</span>
                                </NavLink>
                            ))}
                        </ul>
                    </section>

                    {/* Teams Section */}
                    <section className={cx('section')}>
                        <div className={cx('section-header')}>
                            <span>Nhóm</span>
                            {/* ... */}
                        </div>
                        {/* ... Danh sách nhóm ... */}
                    </section>
                </div>

                {/* Help Section */}
                <div className={cx('help-section')}>
                    <FontAwesomeIcon icon={faQuestionCircle} className={cx('icon')} />
                    <span>Trợ giúp và tài nguyên</span>
                </div>
            </aside>

            {/* Render các Modal */}
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