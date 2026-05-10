import pool from '../config/database.js';

export const createTask = async (req, res, next) => {
    try {
        const { title, description, assigned_to, group_id, due_date } = req.body;
        const [result] = await pool.query(
            'INSERT INTO tasks (title, description, assigned_to, group_id, due_date) VALUES (?, ?, ?, ?, ?)',
            [title, description, assigned_to || null, group_id, due_date || null]
        );
        res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId]);
        res.json({ message: 'Task status updated' });
    } catch (error) {
        next(error);
    }
};

export const getGroupTasks = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const [tasks] = await pool.query(
            `SELECT t.*, u.name as assigned_name 
             FROM tasks t 
             LEFT JOIN users u ON t.assigned_to = u.id 
             WHERE t.group_id = ? 
             ORDER BY t.created_at DESC`,
            [groupId]
        );
        res.json({ tasks });
    } catch (error) {
        next(error);
    }
};

export const getMyTasks = async (req, res, next) => {
    try {
        const [tasks] = await pool.query(
            `SELECT t.*, g.name as group_name 
             FROM tasks t 
             JOIN groups g ON t.group_id = g.id 
             WHERE t.assigned_to = ? 
             ORDER BY t.due_date ASC`,
            [req.user.id]
        );
        res.json({ tasks });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};
