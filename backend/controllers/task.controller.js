// controllers/task.controller.js
const Task = require('../models/task.model');

// Lấy tất cả tasks
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        const newTask = new Task({
            title,
            description,
            dueDate,
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Lỗi khi tạo task:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo task' });
    }
};

// (Tùy chọn) Lấy tất cả task
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách task' });
    }
};

// (Tùy chọn) Xóa task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Đã xóa task' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa task' });
    }
};
exports.toggleTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // 1. Tìm công việc theo ID
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Không tìm thấy công việc' });
        }

        // 2. Đảo ngược trạng thái completed (true -> false, false -> true)
        task.completed = !task.completed;

        // 3. Lưu lại vào CSDL
        await task.save();

        // 4. Trả về công việc đã được cập nhật
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật task' });
    }
};
exports.getUpcomingTasks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt về đầu ngày để so sánh

        const upcomingTasks = await Task.find({
            dueDate: { $gte: today } // Lấy các task có dueDate lớn hơn hoặc bằng hôm nay
        }).sort({ dueDate: 'asc' }); // Sắp xếp theo ngày hết hạn tăng dần

        res.status(200).json(upcomingTasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy tasks sắp tới' });
    }
};