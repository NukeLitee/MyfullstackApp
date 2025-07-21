// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000', // Địa chỉ frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Phải có 'DELETE'
}));
app.use(express.json());

// Kết nối tới MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todolist";
mongoose.connect(MONGO_URI)
    .then(() => console.log('Đã kết nối thành công tới MongoDB!'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Import Routes
const taskRoutes = require('./routes/task.routes');

const projectRoutes = require('./routes/project.routes');
app.use('/api/projects', projectRoutes);
// Sử dụng Routes
// Đây là dòng quan trọng nhất để sửa lỗi "Cannot GET /api/tasks"
app.use('/api/tasks', taskRoutes);

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});