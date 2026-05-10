import pool from '../config/database.js';

export const getBooks = async (req, res, next) => {
    try {
        const [books] = await pool.query(
            'SELECT b.*, (SELECT COUNT(*) FROM `rows` WHERE book_id = b.id) as row_count FROM books b WHERE b.user_id = ? ORDER BY b.updated_at DESC', 
            [req.user.id]
        );

        res.json(books);
    } catch (error) {
        next(error);
    }
};

export const createBook = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { name, type } = req.body;
        
        const [result] = await connection.query(
            'INSERT INTO books (user_id, name, type) VALUES (?, ?, ?)',
            [req.user.id, name, type || 'custom']
        );
        const bookId = result.insertId;
        
        // Create template columns
        const templates = {
            sales: [
                { name: 'Date', data_type: 'date', width: 120 },
                { name: 'Product Name', data_type: 'text', width: 200 },
                { name: 'Quantity', data_type: 'number', width: 100 },
                { name: 'Unit Price', data_type: 'currency', width: 150 },
                { name: 'Total', data_type: 'currency', width: 150, is_formula: true, formula_expression: '{Quantity} * {Unit Price}' }
            ],
            purchase: [
                { name: 'Date', data_type: 'date', width: 120 },
                { name: 'Material', data_type: 'text', width: 200 },
                { name: 'Quantity', data_type: 'number', width: 100 },
                { name: 'Cost', data_type: 'currency', width: 150 },
                { name: 'Total', data_type: 'currency', width: 150, is_formula: true, formula_expression: '{Quantity} * {Cost}' }
            ],
            payroll: [
                { name: 'Staff Name', data_type: 'text', width: 200 },
                { name: 'Work Days', data_type: 'number', width: 120 },
                { name: 'Daily Rate', data_type: 'currency', width: 150 },
                { name: 'Bonus', data_type: 'currency', width: 120 },
                { name: 'Total', data_type: 'currency', width: 150, is_formula: true, formula_expression: '({Work Days} * {Daily Rate}) + {Bonus}' }
            ]
        };
        
        if (templates[type]) {
            let order = 0;
            for (const col of templates[type]) {
                await connection.query(
                    'INSERT INTO `columns` (book_id, name, data_type, col_order, is_formula, formula_expression, width) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [bookId, col.name, col.data_type, order++, col.is_formula || false, col.formula_expression || null, col.width]
                );

            }
        }
        
        await connection.commit();
        res.status(201).json({ id: bookId, name, type });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

export const updateBook = async (req, res, next) => {
    try {
        const { name } = req.body;
        await pool.query('UPDATE books SET name = ? WHERE id = ? AND user_id = ?', [name, req.params.id, req.user.id]);
        res.json({ message: 'Book updated' });
    } catch (error) {
        next(error);
    }
};

export const deleteBook = async (req, res, next) => {
    try {
        await pool.query('DELETE FROM books WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Book deleted' });
    } catch (error) {
        next(error);
    }
};
