const express = require('express');
const {
    createRequest,
    getRequests,
    getUserRequests,
    updateRequest,
    deleteRequest,
    assignHardware,
    detachHardware,
    getHardwareOptions,
} = require('../controllers/requestController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/hardware', getHardwareOptions);

// Create a new request (accessible to authenticated employees)
router.post('/', verifyToken, createRequest);

// Get all requests (admin only, but must be authenticated first)
router.get('/', verifyToken, isAdmin, getRequests);

// Get all requests for the logged-in user
router.get('/user', verifyToken, getUserRequests);

// Update a request (admin only, but must be authenticated first)
router.put('/:id', verifyToken, isAdmin, updateRequest);

// Delete a request (admin only, but must be authenticated first)
router.delete('/:id', verifyToken, isAdmin, deleteRequest);

// Assign hardware to a request (admin only, but must be authenticated first)
router.post('/assign', verifyToken, isAdmin, assignHardware);

// Detach hardware from a request (admin only, but must be authenticated first)
router.post('/detach', verifyToken, isAdmin, detachHardware);

module.exports = router;
