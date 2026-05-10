import express from 'express';
import { createGroup, joinGroup, getMyGroups, getGroupMembers } from '../controllers/groupController.js';
import { checkIn, checkOut, getMyAttendance, getGroupAttendance, getTimekeepingSummary } from '../controllers/attendanceController.js';
import { createReport, getGroupReports } from '../controllers/reportController.js';
import { createTask, updateTaskStatus, getGroupTasks, getMyTasks, deleteTask } from '../controllers/taskController.js';
import { getGroupPersonnel, updateMemberPosition, removeMember } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// Groups
router.get('/groups', getMyGroups);
router.post('/groups', createGroup);
router.post('/groups/join', joinGroup);
router.get('/groups/:groupId/members', getGroupMembers);

// Personnel
router.get('/groups/:groupId/personnel', getGroupPersonnel);
router.put('/groups/:groupId/members/:userId', updateMemberPosition);
router.delete('/groups/:groupId/members/:userId', removeMember);

// Attendance
router.post('/attendance/check-in', checkIn);
router.post('/attendance/check-out', checkOut);
router.get('/attendance/:groupId/me', getMyAttendance);
router.get('/attendance/:groupId/all', getGroupAttendance);
router.get('/attendance/:groupId/summary', getTimekeepingSummary);

// Reports
router.post('/reports', createReport);
router.get('/reports/:groupId', getGroupReports);

// Tasks
router.get('/tasks/my', getMyTasks);
router.get('/tasks/group/:groupId', getGroupTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:taskId/status', updateTaskStatus);
router.delete('/tasks/:taskId', deleteTask);

export default router;
