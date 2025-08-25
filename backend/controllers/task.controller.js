const Task = require('../models/task.model');

// Lấy các task không thuộc dự án nào (Inbox)
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            ownerId: req.user.id,
            projectId: null
        }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách task' });
    }
};

// Tạo task mới
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, projectId } = req.body;
        const newTask = new Task({
            title,
            description,
            dueDate,
            projectId,
            priority: priority ? priority.level : 4,
            ownerId: req.user.id
        });
        const savedTask = await newTask.save();

        // Tạo thông báo
        const notification = new Notification({
            ownerId: req.user.id,
            message: `Bạn vừa tạo công việc mới: "${savedTask.title}"`
        });
        await notification.save();

        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Lỗi khi tạo task:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo task' });
    }
};


// Xóa task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id, ownerId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Không tìm thấy công việc hoặc bạn không có quyền xóa.' });
        }

        // Tạo thông báo
        const notification = new Notification({
            ownerId: req.user.id,
            message: `Bạn đã xóa công việc: "${task.title}"`
        });
        await notification.save();

        res.json({ message: 'Đã xóa task' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa task' });
    }
};

// Cập nhật trạng thái task
exports.toggleTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, ownerId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Không tìm thấy công việc hoặc bạn không có quyền sửa.' });
        }
        task.completed = !task.completed;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật task' });
    }
};

// Lấy các task sắp tới
exports.getUpcomingTasks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingTasks = await Task.find({
            ownerId: req.user.id,
            dueDate: { $gte: today }
        }).sort({ dueDate: 'asc' });
        res.status(200).json(upcomingTasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy tasks sắp tới' });
    }
};

// Lấy tasks theo ID của dự án
exports.getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({
            projectId: projectId,
            ownerId: req.user.id
        }).sort({ createdAt: -1 });
            res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy tasks của dự án' });
    }
};
exports.getCompletedTasks = async (req, res) => {
    try {
        const completedTasks = await Task.find({
            ownerId: req.user.id,
            completed: true // Chỉ lấy các task có trường completed là true
        }).sort({ updatedAt: -1 }); // Sắp xếp theo ngày hoàn thành gần nhất

        res.status(200).json(completedTasks);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy tasks đã hoàn thành' });
    }
};