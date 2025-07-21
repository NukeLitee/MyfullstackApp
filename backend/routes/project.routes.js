const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Áp dụng middleware xác thực cho tất cả các route bên dưới
router.use(authMiddleware);

// GET /api/projects -> Lấy danh sách dự án
router.get('/', projectController.getProjects);

// POST /api/projects -> Tạo dự án mới
router.post('/', projectController.createProject);

module.exports = router;