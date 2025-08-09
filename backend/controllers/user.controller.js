// controllers/user.controller.js
const User = require('../models/user.model');

// Lấy thông tin của người dùng đang đăng nhập
exports.getMyProfile = async (req, res) => {
    try {
        // req.user.id được lấy từ authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // Bỏ qua trường password
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật thông tin của người dùng đang đăng nhập
exports.updateMyProfile = async (req, res) => {
    try {
        const { fullName } = req.body; // Chỉ cho phép cập nhật fullName trong ví dụ này

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { fullName },
            { new: true } // Trả về document đã được cập nhật
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

        // Cập nhật các trường nếu có
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;

        const updatedUser = await user.save();
        const userObject = updatedUser.toObject();
        delete userObject.password; // Xóa password trước khi gửi về

        res.status(200).json(userObject);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
// Cập nhật ảnh đại diện
exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn một file ảnh.' });
        }

        // req.file.path được cung cấp bởi multer
        const avatarUrl = req.file.path;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { avatarUrl },
            { new: true }
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};