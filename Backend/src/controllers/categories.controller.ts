import { pool } from '../db_connection/db';
import { Request, Response } from 'express';

export const findAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query('SELECT * FROM category');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const findCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM category WHERE id = ?', [id]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const [result] = await pool.query(
            'INSERT INTO category (name, description) VALUES (?, ?)',
            [name, description]
        );

        res.status(201).json({ message: 'Category created', categoryId: (result as any).insertId });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || !description) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const [result] = await pool.query(
            'UPDATE category SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );

        if ((result as any).affectedRows > 0) {
            res.json({ message: 'Category updated' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM category WHERE id = ?', [id]);

        if ((result as any).affectedRows > 0) {
            res.json({ message: 'Category deleted' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
