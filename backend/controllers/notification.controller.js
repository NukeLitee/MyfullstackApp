const Notification = require('../models/notification.model');

// Lấy tất cả thông báo của người dùng
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ ownerId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20); // Giới hạn 20 thông báo gần nhất
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};