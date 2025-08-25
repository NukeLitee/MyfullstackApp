// models/notification.model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '#' }, // Đường dẫn khi nhấn vào thông báo
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);