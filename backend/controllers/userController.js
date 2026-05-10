import pool from '../config/database.js';

export const getGroupPersonnel = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const [personnel] = await pool.query(
            `SELECT u.id, u.name, u.phone, u.email, gm.role, gm.position, gm.joined_at 
             FROM users u 
             JOIN group_members gm ON u.id = gm.user_id 
             WHERE gm.group_id = ? 
             ORDER BY gm.role, u.name`,
            [groupId]
        );
        res.json({ personnel });
    } catch (error) {
        next(error);
    }
};

export const updateMemberPosition = async (req, res, next) => {
    try {
        const { groupId, userId } = req.params;
        const { position, role } = req.body;
        
        let query = 'UPDATE group_members SET ';
        const params = [];
        if (position !== undefined) {
            query += 'position = ? ';
            params.push(position);
        }
        if (role !== undefined) {
            if (params.length > 0) query += ', ';
            query += 'role = ? ';
            params.push(role);
        }
        query += 'WHERE group_id = ? AND user_id = ?';
        params.push(groupId, userId);

        await pool.query(query, params);
        res.json({ message: 'Member updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const removeMember = async (req, res, next) => {
    try {
        const { groupId, userId } = req.params;
        await pool.query('DELETE FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, userId]);
        res.json({ message: 'Member removed from group' });
    } catch (error) {
        next(error);
    }
};
