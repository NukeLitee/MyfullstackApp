const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');
const mongoose = require('mongoose');

// Helper function để kiểm tra quyền truy cập dự án (có thể đưa vào middleware riêng)
const checkProjectAccess = async (projectId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) return false; // Kiểm tra định dạng ID
    const project = await mongoose.model('Project').findById(projectId);
    if (!project) return false;

    // Nếu là chủ sở hữu dự án
    if (project.ownerId.toString() === userId) return true;

    // Nếu là thành viên của dự án
    const member = await ProjectMember.findOne({ projectId: projectId, userId: userId });
    if (member) return true;

    return false;
};


// @desc    Lấy tất cả nhiệm vụ của người dùng (có thể lọc theo dự án, trạng thái, ngày)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    const { projectId, status, dueDate, priority, search } = req.query; // Lấy các query params
    const filter = { creatorId: req.user.id }; // Mặc định chỉ lấy task của người dùng hiện tại

    // Lọc theo ProjectId (nếu có)
    if (projectId) {
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ msg: 'ID dự án không hợp lệ.' });
        }
        const hasAccess = await checkProjectAccess(projectId, req.user.id);
        if (!hasAccess) {
            return res.status(403).json({ msg: 'Bạn không có quyền truy cập dự án này.' });
        }
        filter.projectId = projectId;
    } else {
        // Nếu không có projectId, thì lọc cho các view như "Inbox", "Today", "Upcoming"
        // Cho "Inbox": tasks.projectId = null hoặc undefined
        // Cho "Today", "Upcoming": Lọc theo dueDate
    }

    // Lọc theo trạng thái hoàn thành
    if (status === 'completed') {
        filter.isCompleted = true;
    } else if (status === 'uncompleted') {
        filter.isCompleted = false;
    }

    // Lọc theo ngày đáo hạn (cần xử lý phức tạp hơn cho "Today", "Upcoming")
    if (dueDate === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        filter.dueDate = { $gte: startOfDay, $lte: endOfDay };
        filter.isCompleted = false; // Nhiệm vụ hôm nay thì chưa hoàn thành
    } else if (dueDate === 'upcoming') {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + 7); // Trong 7 ngày tới
        filter.dueDate = { $gte: now, $lte: futureDate };
        filter.isCompleted = false; // Nhiệm vụ sắp tới thì chưa hoàn thành
    }

    // Lọc theo ưu tiên
    if (priority) {
        const p = parseInt(priority);
        if (!isNaN(p) && p >= 0 && p <= 3) {
            filter.priority = p;
        }
    }

    // Tìm kiếm theo tiêu đề
    if (search) {
        filter.title = { $regex: new RegExp(search, 'i') }; // Tìm kiếm không phân biệt chữ hoa/thường
    }

    try {
        const tasks = await Task.find(filter).sort({ orderIndex: 1, dueDate: 1, priority: -1 }); // Sắp xếp theo thứ tự, ngày đáo hạn, ưu tiên
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// @desc    Tạo nhiệm vụ mới
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    const { projectId, assignedTo, title, description, dueDate, priority, orderIndex } = req.body;

    try {
        // Kiểm tra nếu có projectId thì người dùng phải có quyền trong dự án đó
        if (projectId) {
            const hasAccess = await checkProjectAccess(projectId, req.user.id);
            if (!hasAccess) {
                return res.status(403).json({ msg: 'Bạn không có quyền tạo nhiệm vụ trong dự án này.' });
            }
        }

        const newTask = new Task({
            projectId,
            creatorId: req.user.id,
            assignedTo,
            title,
            description,
            dueDate,
            priority,
            orderIndex: orderIndex !== undefined ? orderIndex : 0 // Nếu không gửi, mặc định 0
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// @desc    Cập nhật nhiệm vụ
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    const { projectId, assignedTo, title, description, dueDate, priority, isCompleted, orderIndex } = req.body;
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Nhiệm vụ không tìm thấy.' });

        // Đảm bảo chỉ người tạo nhiệm vụ mới có thể chỉnh sửa
        if (task.creatorId.toString() !== req.user.id) {
            // Hoặc: nếu người dùng là admin của project cũng được sửa
            const hasProjectAdminAccess = task.projectId ? await ProjectMember.findOne({ projectId: task.projectId, userId: req.user.id, role: 'admin' }) : false;
            if (!hasProjectAdminAccess) {
                return res.status(403).json({ msg: 'Bạn không có quyền cập nhật nhiệm vụ này.' });
            }
        }

        // Nếu muốn thay đổi projectId, cần kiểm tra quyền truy cập dự án mới
        if (projectId && task.projectId && projectId.toString() !== task.projectId.toString()) {
            const hasNewProjectAccess = await checkProjectAccess(projectId, req.user.id);
            if (!hasNewProjectAccess) {
                return res.status(403).json({ msg: 'Bạn không có quyền chuyển nhiệm vụ đến dự án này.' });
            }
        }


        task.projectId = projectId !== undefined ? projectId : task.projectId;
        task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
        task.priority = priority !== undefined ? priority : task.priority;
        if (typeof isCompleted === 'boolean') {
            task.isCompleted = isCompleted;
        }
        task.orderIndex = orderIndex !== undefined ? orderIndex : task.orderIndex;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// @desc    Xóa nhiệm vụ
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Nhiệm vụ không tìm thấy.' });

        // Chỉ người tạo nhiệm vụ mới có quyền xóa
        if (task.creatorId.toString() !== req.user.id) {
            // Hoặc: nếu người dùng là admin của project cũng được xóa
            const hasProjectAdminAccess = task.projectId ? await ProjectMember.findOne({ projectId: task.projectId, userId: req.user.id, role: 'admin' }) : false;
            if (!hasProjectAdminAccess) {
                return res.status(403).json({ msg: 'Bạn không có quyền xóa nhiệm vụ này.' });
            }
        }

        await task.remove();
        res.json({ msg: 'Nhiệm vụ đã được xóa.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};