const Project = require('../models/project.model');
const Task = require('../models/task.model'); // ✅ THÊM DÒNG NÀY VÀO
const User = require('../models/user.model');
const ProjectMember = require('../models/projectMember.model');

// Lấy tất cả dự án của người dùng đang đăng nhập
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ ownerId: req.user.id }).sort({ createdAt: 1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách dự án' });
    }
};

// Lấy thông tin một dự án bằng ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.projectId,
            ownerId: req.user.id
        });
        if (!project) {
            return res.status(404).json({ message: 'Không tìm thấy dự án.' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Tạo một dự án mới
exports.createProject = async (req, res) => {
    try {
        const { name, color, layout, isFavorite } = req.body;
        const ownerId = req.user.id; // Lấy từ middleware

        if (!name) {
            return res.status(400).json({ message: 'Tên dự án là bắt buộc' });
        }

        const newProject = new Project({ name, color, layout, isFavorite, ownerId });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo dự án' });
    }
};
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const ownerId = req.user.id;

        // 1. Kiểm tra xem người dùng có phải chủ sở hữu dự án không
        const project = await Project.findOne({ _id: projectId, ownerId });
        if (!project) {
            return res.status(404).json({ message: 'Không tìm thấy dự án hoặc bạn không có quyền.' });
        }

        // 2. Xóa tất cả các task thuộc về dự án này
        // Dòng này sẽ không còn gây lỗi sau khi đã import Task model
        await Task.deleteMany({ projectId: projectId });

        // 3. Xóa chính dự án đó
        await Project.findByIdAndDelete(projectId);

        res.status(200).json({ message: 'Đã xóa dự án thành công.' });
    } catch (error) {
        // In lỗi chi tiết ra terminal của backend để gỡ lỗi
        console.error("Lỗi khi xóa dự án:", error);
        res.status(500).json({ message: 'Lỗi server khi xóa dự án' });
    }
};
exports.addMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body; // Email của người cần mời
        const ownerId = req.user.id;

        // 1. Kiểm tra người mời có phải chủ dự án không
        const project = await Project.findOne({ _id: projectId, ownerId });
        if (!project) return res.status(403).json({ message: 'Bạn không có quyền mời thành viên.' });

        // 2. Tìm người dùng được mời bằng email
        const member = await User.findOne({ email });
        if (!member) return res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });

        // 3. Kiểm tra xem người đó đã là thành viên chưa
        const existingMember = await ProjectMember.findOne({ projectId, userId: member._id });
        if (existingMember) return res.status(400).json({ message: 'Người dùng này đã là thành viên.' });

        // 4. Thêm thành viên mới
        const newMember = new ProjectMember({ projectId, userId: member._id });
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};