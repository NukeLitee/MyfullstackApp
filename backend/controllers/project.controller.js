const Project = require('../models/project.model');

// Lấy tất cả dự án của một người dùng
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ ownerId: req.user.id }).sort({ createdAt: 1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Tạo dự án mới
exports.createProject = async (req, res) => {
    try {
        const { name, color, layout, isFavorite } = req.body;
        const ownerId = req.user.id; // Lấy ID từ middleware xác thực

        const newProject = new Project({
            name, color, layout, isFavorite, ownerId
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};