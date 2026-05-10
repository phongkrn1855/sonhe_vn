import pool from '../config/database.js';

export const getColumns = async (req, res, next) => {
    try {
        const [columns] = await pool.query('SELECT * FROM `columns` WHERE book_id = ? ORDER BY col_order ASC', [req.params.bookId]);
        res.json(columns);
    } catch (error) {
        next(error);
    }
};

export const createColumn = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { name, data_type, is_formula, formula_expression } = req.body;
        
        const [existing] = await pool.query('SELECT MAX(col_order) as max_order FROM `columns` WHERE book_id = ?', [bookId]);
        const order = (existing[0].max_order !== null ? existing[0].max_order + 1 : 0);
        
        const [result] = await pool.query(
            'INSERT INTO `columns` (book_id, name, data_type, col_order, is_formula, formula_expression) VALUES (?, ?, ?, ?, ?, ?)',
            [bookId, name, data_type || 'text', order, is_formula || false, formula_expression || null]
        );
        res.status(201).json({ id: result.insertId, name, data_type, col_order: order, is_formula, formula_expression });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Column with this name already exists' });
        }
        next(error);
    }
};

export const updateColumn = async (req, res, next) => {
    try {
        const { name, data_type, is_formula, formula_expression } = req.body;
        await pool.query(
            'UPDATE `columns` SET name = ?, data_type = ?, is_formula = ?, formula_expression = ? WHERE id = ?',
            [name, data_type, is_formula, formula_expression, req.params.id]
        );
        res.json({ message: 'Column updated' });
    } catch (error) {
        next(error);
    }
};

export const deleteColumn = async (req, res, next) => {
    try {
        await pool.query('DELETE FROM `columns` WHERE id = ?', [req.params.id]);
        res.json({ message: 'Column deleted' });
    } catch (error) {
        next(error);
    }
};

export const reorderColumns = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { columnIds } = req.body; // Array of IDs in new order
        for (let i = 0; i < columnIds.length; i++) {
            await connection.query('UPDATE `columns` SET col_order = ? WHERE id = ?', [i, columnIds[i]]);
        }
        await connection.commit();
        res.json({ message: 'Columns reordered' });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};
