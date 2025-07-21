// controllers/task.controller.js
const Task = require('../models/task.model');

// Lấy tất cả tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy tasks' });
    }
};

// Tạo một task mới
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Tiêu đề là bắt buộc' });
        }
        const newTask = new Task({ title, description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo task' });
    }
};
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Không tìm thấy công việc' });
        }

        res.status(200).json({ message: 'Đã xóa công việc thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa task' });
    }
};