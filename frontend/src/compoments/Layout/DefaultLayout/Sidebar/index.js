import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';
import ProfileModal from '../ProfileModal';
import AddProjectModal from '../../../store/AddProjectModal';
import { useProjects } from '../../../../hooks/useProjects';
import { useAuth } from '../../../../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faSearch, faInbox, faCalendarDay, faCalendarAlt,
    faCheckCircle, faUser, faChevronDown, faBell, faArchive,
    faHashtag
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Sidebar() {
    const { projects, addProject } = useProjects();
    const { user } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);

    const handleAddProject = async (projectData) => {
        const success = await addProject(projectData);
        if (success) {
            setShowAddProjectModal(false);
        } else {
            alert("Tạo dự án thất bại!");
        }
    };

    return (
        <>
            <aside className={cx('wrapper')}>
                {/* User Menu */}
                <div className={cx('user-menu')} onClick={() => setShowProfileModal(true)}>
                    <div className={cx('user-avatar')}>
                        {user && user.avatarUrl ? (
                            <img src={`${process.env.REACT_APP_API_URL}/${user.avatarUrl.replace(/\\/g, '/')}`} alt={user.fullName} className={cx('user-avatar-img')} />
                        ) : (
                            <FontAwesomeIcon icon={faUser} />
                        )}
                    </div>
                    <span>{user ? user.fullName : 'Name'}</span>
                    <FontAwesomeIcon icon={faChevronDown} className={cx('arrow-icon')} />
                    <div className={cx('user-actions')}>
                        <FontAwesomeIcon icon={faBell} />
                        <FontAwesomeIcon icon={faArchive} />
                    </div>
                </div>

                {/* Navigation */}
                <nav className={cx('navigation')}>
                    <ul className={cx('nav-list')}>
                        <li><NavLink to="/add-task" className={({ isActive }) => cx('nav-item', { active: isActive })}>
                            <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
                            <span>Add Task</span>
                        </NavLink></li>
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
                            <FontAwesomeIcon icon={faPlus} onClick={(e) => { e.stopPropagation(); setShowAddProjectModal(true); }} />
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    </div>
                    <ul className={cx('project-list')}>
                        {projects.map(project => (
                            <li key={project._id}>
                                <NavLink
                                    to={`/project/${project._id}`}
                                    className={({ isActive }) => cx('project-item', { active: isActive })}
                                >
                                    <FontAwesomeIcon icon={faHashtag} className={cx('icon')} />
                                    <span>{project.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </section>
            </aside>
            <ProfileModal show={showProfileModal} onClose={() => setShowProfileModal(false)} />
            <AddProjectModal show={showAddProjectModal} onClose={() => setShowAddProjectModal(false)} onAddProject={handleAddProject} />
        </>
    );
}

export default Sidebar;