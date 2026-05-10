import pool from '../config/database.js';

export const checkIn = async (req, res, next) => {
    try {
        const { groupId, note } = req.body;
        
        // Check if already checked in today
        const [existing] = await pool.query(
            'SELECT id FROM attendance WHERE user_id = ? AND group_id = ? AND DATE(check_in) = CURDATE()',
            [req.user.id, groupId]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Hôm nay bạn đã điểm danh rồi' });
        }
        
        await pool.query(
            'INSERT INTO attendance (user_id, group_id, note) VALUES (?, ?, ?)',
            [req.user.id, groupId, note]
        );
        
        res.status(201).json({ message: 'Check-in successful' });
    } catch (error) {
        next(error);
    }
};

export const checkOut = async (req, res, next) => {
    try {
        const { groupId } = req.body;
        
        const [result] = await pool.query(
            'UPDATE attendance SET check_out = NOW() WHERE user_id = ? AND group_id = ? AND DATE(check_in) = CURDATE() AND check_out IS NULL',
            [req.user.id, groupId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Không tìm thấy lượt check-in chưa kết thúc' });
        }
        
        res.json({ message: 'Check-out successful' });
    } catch (error) {
        next(error);
    }
};

export const getMyAttendance = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const [history] = await pool.query(
            'SELECT * FROM attendance WHERE user_id = ? AND group_id = ? ORDER BY check_in DESC',
            [req.user.id, groupId]
        );
        res.json({ history });
    } catch (error) {
        next(error);
    }
};

export const getGroupAttendance = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { date } = req.query; // optional YYYY-MM-DD
        const targetDate = date || 'CURDATE()';
        
        const [records] = await pool.query(
            `SELECT a.*, u.name, u.email 
             FROM attendance a 
             JOIN users u ON a.user_id = u.id 
             WHERE a.group_id = ? AND DATE(a.check_in) = ${date ? '?' : targetDate}`,
            date ? [groupId, targetDate] : [groupId]
        );
        res.json({ records });
    } catch (error) {
        next(error);
    }
};

export const getTimekeepingSummary = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { month, year } = req.query; // optional
        const targetMonth = month || (new Date().getMonth() + 1);
        const targetYear = year || new Date().getFullYear();

        const [summary] = await pool.query(
            `SELECT u.id as user_id, u.name, 
                    COUNT(a.id) as total_days,
                    SUM(TIMESTAMPDIFF(HOUR, a.check_in, a.check_out)) as total_hours
             FROM group_members gm
             JOIN users u ON gm.user_id = u.id
             LEFT JOIN attendance a ON u.id = a.user_id AND a.group_id = gm.group_id 
                AND MONTH(a.check_in) = ? AND YEAR(a.check_in) = ?
             WHERE gm.group_id = ?
             GROUP BY u.id, u.name`,
            [targetMonth, targetYear, groupId]
        );
        res.json({ summary, month: targetMonth, year: targetYear });
    } catch (error) {
        next(error);
    }
};
