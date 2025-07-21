// routes/task.routes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// GET: /api/tasks (Lấy tất cả tasks)
router.get('/', taskController.getTasks);

// POST: /api/tasks (Tạo một task mới)
router.post('/', taskController.createTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;