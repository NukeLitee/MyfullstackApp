const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Tất cả các route trong file này đều yêu cầu xác thực
router.use(authMiddleware);

// GET /api/users/me -> Lấy profile của tôi
router.get('/me', userController.getMyProfile);

// PUT /api/users/me -> Cập nhật profile của tôi
router.put('/me', userController.updateMyProfile);

router.post('/me/avatar', upload.single('avatar'), userController.updateAvatar);

module.exports = router;