const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const mongoose = require('mongoose');

// @desc    Lấy tất cả dự án (người dùng là owner hoặc member)
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        // Tìm các dự án mà người dùng là owner
        const ownedProjects = await Project.find({ ownerId: req.user.id });

        // Tìm các dự án mà người dùng là thành viên
        const memberOfProjects = await ProjectMember.find({ userId: req.user.id }).populate('projectId'); // Populate để lấy thông tin Project

        // Kết hợp và loại bỏ trùng lặp
        const projects = [...ownedProjects, ...memberOfProjects.map(pm => pm.projectId)];

        // Đảm bảo không trùng lặp nếu người dùng vừa là owner vừa là member
        const uniqueProjects = Array.from(new Map(projects.map(p => [p.id, p])).values());

        res.json(uniqueProjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// @desc    Tạo dự án mới
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
    const { name, description, color } = req.body;
    try {
        const newProject = new Project({
            ownerId: req.user.id,
            name,
            description,
            color
        });

        const project = await newProject.save();

        // Tự động thêm người tạo làm admin của dự án trong ProjectMember
        const newProjectMember = new ProjectMember({
            projectId: project._id,
            userId: req.user.id,
            role: 'admin'
        });
        await newProjectMember.save();

        res.status(201).json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// @desc    Cập nhật dự án
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
    const { name, description, color, isArchived } = req.body;
    try {
        let project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ msg: 'Dự án không tìm thấy.' });

        // Kiểm tra quyền: chỉ owner hoặc admin của dự án mới có thể cập nhật
        const isOwner = project.ownerId.toString() === req.user.id;
        const projectMember = await ProjectMember.findOne({ projectId: req.params.id, userId: req.user.id });
        const isAdmin = projectMember && projectMember.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ msg: 'Bạn không có quyền cập nhật dự án này.' });
        }

        project.name = name || project.name;
        project.description = description || project.description;
        project.color = color || project.color;
        if (typeof isArchived === 'boolean') {
            project.isArchived = isArchived;
        }

        await project.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// @desc    Xóa dự án
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
    // Cần đảm bảo chỉ owner hoặc admin có quyền xóa, và xóa cả task/projectMember liên quan
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Dự án không tìm thấy.' });

        // Chỉ owner mới có quyền xóa dự án (hoặc thêm điều kiện admin nếu muốn)
        if (project.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Bạn không có quyền xóa dự án này.' });
        }

        // Xóa tất cả tasks liên quan đến dự án này
        await mongoose.model('Task').deleteMany({ projectId: req.params.id });
        // Xóa tất cả projectMembers liên quan đến dự án này
        await ProjectMember.deleteMany({ projectId: req.params.id });

        await project.remove();
        res.json({ msg: 'Dự án đã được xóa.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// @desc    Thêm thành viên vào dự án
// @route   POST /api/projects/:id/members
// @access  Private
exports.addProjectMember = async (req, res) => {
    const { email, role = 'member' } = req.body; // Mặc định role là 'member'
    try {
        // 1. Kiểm tra quyền của người gửi request (phải là admin của dự án)
        const projectMember = await ProjectMember.findOne({ projectId: req.params.id, userId: req.user.id });
        if (!projectMember || projectMember.role !== 'admin') {
            return res.status(403).json({ msg: 'Bạn không có quyền thêm thành viên vào dự án này.' });
        }

        // 2. Tìm người dùng mục tiêu bằng email
        const targetUser = await mongoose.model('User').findOne({ email });
        if (!targetUser) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng với email này.' });
        }

        // 3. Kiểm tra xem người dùng đã là thành viên chưa
        const existingMember = await ProjectMember.findOne({ projectId: req.params.id, userId: targetUser._id });
        if (existingMember) {
            return res.status(400).json({ msg: 'Người dùng đã là thành viên của dự án này.' });
        }

        // 4. Thêm thành viên mới
        const newMember = new ProjectMember({
            projectId: req.params.id,
            userId: targetUser._id,
            role
        });
        await newMember.save();

        res.status(201).json({ msg: 'Thêm thành viên thành công.', member: newMember });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// @desc    Lấy danh sách thành viên dự án
// @route   GET /api/projects/:id/members
// @access  Private
exports.getProjectMembers = async (req, res) => {
    try {
        // Kiểm tra xem người dùng có phải là thành viên của dự án không
        const projectMember = await ProjectMember.findOne({ projectId: req.params.id, userId: req.user.id });
        if (!projectMember) {
            return res.status(403).json({ msg: 'Bạn không có quyền xem thành viên của dự án này.' });
        }

        const members = await ProjectMember.find({ projectId: req.params.id })
            .populate('userId', 'email username'); // Lấy thông tin email và username của user

        res.json(members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};