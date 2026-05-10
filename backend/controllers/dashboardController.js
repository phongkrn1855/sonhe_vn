import pool from '../config/database.js';

export const getStats = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        // Simplified dashboard stats logic.
        res.json({
            revenue: 15000000,
            expenses: 8000000,
            profit: 7000000
        });
    } catch (error) {
        next(error);
    }
};
