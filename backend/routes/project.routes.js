const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Áp dụng middleware xác thực cho tất cả các route của project
router.use(authMiddleware);

// GET /api/projects -> Lấy danh sách dự án
router.get('/', projectController.getProjects);

// POST /api/projects -> Tạo dự án mới
router.post('/', projectController.createProject);

// GET /api/projects/:projectId -> Lấy một dự án cụ thể
router.get('/:projectId', projectController.getProjectById);

router.delete('/:projectId', projectController.deleteProject);

module.exports = router;