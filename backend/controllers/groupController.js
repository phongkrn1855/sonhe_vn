import pool from '../config/database.js';

export const createGroup = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const invite_code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const [result] = await pool.query(
            'INSERT INTO groups (name, description, invite_code, owner_id) VALUES (?, ?, ?, ?)',
            [name, description, invite_code, req.user.id]
        );
        
        const groupId = result.insertId;
        
        // Add creator as admin member
        await pool.query(
            'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
            [groupId, req.user.id, 'admin']
        );
        
        res.status(201).json({ message: 'Group created successfully', groupId, invite_code });
    } catch (error) {
        next(error);
    }
};

export const joinGroup = async (req, res, next) => {
    try {
        const { invite_code } = req.body;
        const [groups] = await pool.query('SELECT id FROM groups WHERE invite_code = ?', [invite_code]);
        
        if (groups.length === 0) {
            return res.status(404).json({ error: 'Mã mời không hợp lệ' });
        }
        
        const groupId = groups[0].id;
        
        // Check if already a member
        const [existing] = await pool.query(
            'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
            [groupId, req.user.id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Bạn đã là thành viên của nhóm này' });
        }
        
        await pool.query(
            'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
            [groupId, req.user.id]
        );
        
        res.json({ message: 'Joined group successfully', groupId });
    } catch (error) {
        next(error);
    }
};

export const getMyGroups = async (req, res, next) => {
    try {
        const [groups] = await pool.query(
            `SELECT g.*, gm.role 
             FROM groups g 
             JOIN group_members gm ON g.id = gm.group_id 
             WHERE gm.user_id = ?`,
            [req.user.id]
        );
        res.json({ groups });
    } catch (error) {
        next(error);
    }
};

export const getGroupMembers = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const [members] = await pool.query(
            `SELECT u.id, u.name, u.email, u.phone, gm.role, gm.joined_at 
             FROM users u 
             JOIN group_members gm ON u.id = gm.user_id 
             WHERE gm.group_id = ?`,
            [groupId]
        );
        res.json({ members });
    } catch (error) {
        next(error);
    }
};
