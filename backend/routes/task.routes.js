// routes/task.routes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// POST: Tạo task
router.post('/', taskController.createTask);

// GET: Lấy danh sách task
router.get('/', taskController.getAllTasks);

// DELETE: Xóa task theo id
router.delete('/:id', taskController.deleteTask);

router.patch('/:id/toggle', taskController.toggleTaskStatus);

router.get('/upcoming', taskController.getUpcomingTasks);


module.exports = router;