import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import api from '../../services/api';

import styles from './ProjectView.module.scss';
import AddTaskForm from '../../compoments/store/AddTaskForm';
import TaskItem from '../../compoments/store/TaskItem'; // Đảm bảo đây là TaskItem, không phải TaskList
import { faPlus, faListAlt } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ProjectView() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');

    const fetchProjectData = useCallback(async () => {
        if (!projectId) return;
        console.log(`[EFFECT] Bắt đầu lấy dữ liệu cho project ID: ${projectId}`);
        try {
            const [projectResponse, tasksResponse] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get(`/tasks/project/${projectId}`)
            ]);

            console.log('[EFFECT] Dữ liệu tasks nhận được:', tasksResponse.data);
            setProject(projectResponse.data);
            setTasks(tasksResponse.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu dự án:", error);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);
    const handleInviteMember = async () => {
        if (!inviteEmail.trim()) {
            alert('Vui lòng nhập email của thành viên cần mời.');
            return;
        }
        try {
            await api.post(`/projects/${projectId}/members`, { email: inviteEmail });
            alert(`Đã gửi lời mời đến ${inviteEmail}!`);
            setInviteEmail(''); // Xóa nội dung input sau khi gửi
            // Trong ứng dụng thật, bạn nên fetch lại danh sách thành viên
        } catch (error) {
            alert(error.response?.data?.message || 'Mời thành viên thất bại.');
        }
    };
    const handleAddTask = async (taskData) => {
        console.log('[HANDLER] Bắt đầu thêm task. Dữ liệu:', taskData);
        try {
            const response = await api.post('/tasks', { ...taskData, projectId });
            const newTask = response.data;

            console.log('[HANDLER] API đã trả về task mới:', newTask);

            setTasks(prevTasks => {
                const newState = [newTask, ...prevTasks];
                console.log('[HANDLER] State tasks MỚI sẽ được set:', newState);
                return newState;
            });
            setShowAddTask(false);
        } catch (error) {
            console.error("Lỗi khi tạo task:", error);
            alert("Tạo task thất bại!");
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            // 1. Gọi API PATCH đến backend bằng 'api' client
            // Đường dẫn tương đối là đủ vì baseURL đã được cấu hình
            const response = await api.patch(`/tasks/${taskId}/toggle`);
            const updatedTask = response.data;

            // 2. Cập nhật lại state tasks trên UI một cách chính xác
            // Dùng .map() để tìm và thay thế đúng công việc đã được cập nhật
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? updatedTask : task
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái task:", error);
            // Có thể thêm thông báo lỗi cho người dùng ở đây nếu cần
        }
    };
    const handleDeleteTask = async (taskId) => {
        // Thêm bước xác nhận để tránh người dùng xóa nhầm
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            try {
                // 1. Gọi API DELETE đến backend
                await api.delete(`/tasks/${taskId}`);

                // 2. Cập nhật lại state tasks trên UI bằng cách lọc bỏ task đã xóa
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            } catch (error) {
                console.error("Lỗi khi xóa task:", error);
                alert("Xóa task thất bại!");
            }
        }
    };

    console.log(`[RENDER] Component đang render với ${tasks.length} task(s).`);

    return (
        <main className={cx('wrapper')}>
            <header className={cx('header')}>
                <h1 className={cx('title')}>{project ? project.name : 'Đang tải...'}</h1>
                <button className={cx('view-switcher')}>
                    <span>Danh sách</span>
                </button>
            </header>
            <div className={cx('invite-section')}>
                <input
                    type="email"
                    placeholder="Nhập email để mời..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className={cx('invite-input')}
                />
                <button className={cx('invite-btn')} onClick={handleInviteMember}>Mời</button>
            </div>
            <div className={cx('task-container')}>
                {tasks && tasks.map(task => (
                    <TaskItem
                        key={task._id}
                        task={task}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                    />
                ))}

                {showAddTask && (
                    <AddTaskForm
                        onAddTask={handleAddTask}
                        onCancel={() => setShowAddTask(false)}
                    />
                )}

                {!showAddTask && (
                    <button
                        className={cx('add-task-inline-btn')}
                        onClick={() => setShowAddTask(true)}
                    >
                        <span>Add Task</span>
                    </button>
                )}
            </div>
        </main>
    );
}

export default ProjectView;