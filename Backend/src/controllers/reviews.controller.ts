import { pool } from '../db_connection/db';
import { Request, Response } from 'express';

export const findAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query('SELECT * FROM reviews');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const findReviewById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { stars, comment, entry_date, fk_product } = req.body;

        if (!stars || !comment || !entry_date || !fk_product) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const [result] = await pool.query(
            'INSERT INTO reviews (stars, comment, entry_date, fk_product) VALUES (?, ?, ?, ?)',
            [stars, comment, entry_date, fk_product]
        );

        res.status(201).json({ message: 'Review created', reviewId: (result as any).insertId });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { stars, comment, entry_date, fk_product } = req.body;

        if (!stars || !comment || !entry_date || !fk_product) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const [result] = await pool.query(
            'UPDATE reviews SET stars = ?, comment = ?, entry_date = ?, fk_product = ? WHERE id = ?',
            [stars, comment, entry_date, fk_product, id]
        );

        if ((result as any).affectedRows > 0) {
            res.json({ message: 'Review updated' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);

        if ((result as any).affectedRows > 0) {
            res.json({ message: 'Review deleted' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
