import { pool } from '../db_connection/db';
import { Request, Response } from 'express';

// Obtener todos los roles
export const findAllRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query('SELECT * FROM Rol');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Obtener un rol por ID
export const findRoleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Rol WHERE id = ?', [id]);

        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Role not found' });
        }
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Crear un nuevo rol
export const createRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { description } = req.body;

        if (!description) {
            res.status(400).json({ message: 'Description is required' });
            return;
        }

        const [result] = await pool.query(
            'INSERT INTO Rol (description) VALUES (?)',
            [description]
        );

        res.status(201).json({ message: 'Role created', roleId: (result as any).insertId });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Actualizar un rol
export const updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!description) {
            res.status(400).json({ message: 'Description is required' });
            return;
        }

        const [result] = await pool.query(
            'UPDATE Rol SET description = ? WHERE id = ?',
            [description, id]
        );

        if ((result as any).affectedRows > 0) {
            res.json({ message: 'Role updated' });
        } else {
            res.status(404).json({ message: 'Role not found' });
        }
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Eliminar un rol
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Rol WHERE id = ?', [id]);

        if ((result as any).affectedRows > 0) {
            res.json({ message: 'Role deleted' });
        } else {
            res.status(404).json({ message: 'Role not found' });
        }
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
