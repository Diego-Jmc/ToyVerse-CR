import { pool } from '../db_connection/db';
import { Request, Response } from 'express';

export const findAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query('SELECT * FROM product');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const findProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM product WHERE id = ?', [id]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, fk_user, img_url, price, fk_category, entry_date } = req.body;

        if (!title || !description || !fk_user || !img_url || !price || !fk_category || !entry_date) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const [result] = await pool.query(
            'INSERT INTO product (title, description, fk_user, img_url, price, fk_category, entry_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, fk_user, img_url, price, fk_category, entry_date]
        );

        res.status(201).json({ message: 'Product created', productId: (result as any).insertId });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, fk_user, img_url, price, fk_category, entry_date } = req.body;

        if (!title || !description || !fk_user || !img_url || !price || !fk_category || !entry_date) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const [result] = await pool.query(
            'UPDATE product SET title = ?, description = ?, fk_user = ?, img_url = ?, price = ?, fk_category = ?, entry_date = ? WHERE id = ?',
            [title, description, fk_user, img_url, price, fk_category, entry_date, id]
        );

        if ((result as any).affectedRows > 0) {
            res.json({ message: 'Product updated' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM product WHERE id = ?', [id]);

        if ((result as any).affectedRows > 0) {
            res.json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
