const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject, addProjectMember, getProjectMembers } = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getProjects)
    .post(protect, createProject);

router.route('/:id')
    .put(protect, updateProject)
    .delete(protect, deleteProject);

router.route('/:id/members')
    .post(protect, addProjectMember) // Thêm thành viên vào dự án
    .get(protect, getProjectMembers); // Lấy danh sách thành viên dự án

module.exports = router;