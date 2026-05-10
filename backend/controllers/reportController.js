import pool from '../config/database.js';

export const createReport = async (req, res, next) => {
    try {
        const { groupId, content, attachments } = req.body;
        
        await pool.query(
            'INSERT INTO reports (user_id, group_id, content, attachments) VALUES (?, ?, ?, ?)',
            [req.user.id, groupId, content, JSON.stringify(attachments || [])]
        );
        
        res.status(201).json({ message: 'Report posted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getGroupReports = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const [reports] = await pool.query(
            `SELECT r.*, u.name, u.email 
             FROM reports r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.group_id = ? 
             ORDER BY r.created_at DESC`,
            [groupId]
        );
        res.json({ reports });
    } catch (error) {
        next(error);
    }
};
