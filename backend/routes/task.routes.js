const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/upcoming', taskController.getUpcomingTasks);
router.get('/completed', taskController.getCompletedTasks);
router.get('/project/:projectId', taskController.getTasksByProject);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/toggle', taskController.toggleTaskStatus);

module.exports = router;