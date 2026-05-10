import pool from '../config/database.js';

export const getRows = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const [rows] = await pool.query('SELECT * FROM `rows` WHERE book_id = ? ORDER BY id ASC LIMIT ? OFFSET ?', [bookId, limit, offset]);
        const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM `rows` WHERE book_id = ?', [bookId]);
        
        if (rows.length === 0) return res.json({ data: [], total: totalCount[0].count, page, limit });

        const rowIds = rows.map(r => r.id);
        const [values] = await pool.query('SELECT * FROM row_values WHERE row_id IN (?)', [rowIds]);

        const mappedRows = rows.map(row => {
            const cellValues = {};
            values.filter(v => v.row_id === row.id).forEach(v => {
                cellValues[v.column_id] = v.value;
            });
            return { id: row.id, book_id: row.book_id, created_at: row.created_at, values: cellValues };
        });

        res.json({
            data: mappedRows,
            total: totalCount[0].count,
            page,
            limit
        });
    } catch (error) {
        next(error);
    }
};

export const createRow = async (req, res, next) => {
    try {
        const [result] = await pool.query('INSERT INTO `rows` (book_id) VALUES (?)', [req.params.bookId]);
        res.status(201).json({ id: result.insertId, values: {} });
    } catch (error) {
        next(error);
    }
};

export const deleteRow = async (req, res, next) => {
    try {
        await pool.query('DELETE FROM `rows` WHERE id = ?', [req.params.rowId]);
        res.json({ message: 'Row deleted' });
    } catch (error) {
        next(error);
    }
};

export const updateCell = async (req, res, next) => {
    try {
        const { rowId, columnId } = req.params;
        const { value } = req.body;
        
        // Upsert logic for MySQL
        await pool.query(
            `INSERT INTO row_values (row_id, column_id, value) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE value = VALUES(value)`,
            [rowId, columnId, value]
        );
        res.json({ message: 'Cell updated' });
    } catch (error) {
        next(error);
    }
};

export const recalculateFormulas = async (req, res, next) => {
    res.json({ message: 'Recalculation handled on frontend, values synced.' });
};
