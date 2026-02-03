import { pool } from '../config/db';
import { User } from '../models/user';

export const getUsers = async (): Promise<User[]> => {
    const result = await pool.query(`SELECT * FROM users WHERE deleted_at IS NULL`);
    return result.rows;
};

export const getUserById = async (id: string | string[]): Promise<User | null> => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`, [id]);
    return result.rows[0] || null;
};

export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<User> => {
    const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, number, role_id, active, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
        [user.email, user.password_hash, user.name, user.number, user.role_id, user.active],
    );
    return result.rows[0];
};

export const updateUser = async (id: string | string[], user: Partial<User>): Promise<User | null> => {
    const updates = Object.entries(user).map(([key, value], index) => `${key} = $${index + 2}`).join(', ');
    const result = await pool.query(
        `UPDATE users SET ${updates}, updated_at = NOW() 
     WHERE id = $1 AND deleted_at IS NULL 
     RETURNING *`,
        [id, ...Object.values(user)],
    );
    return result.rows[0] || null;
};

export const deleteUser = async (id: string | string[]): Promise<void> => {
    await pool.query(`UPDATE users SET deleted_at = NOW() WHERE id = ANY($1::text[])`, [Array.isArray(id) ? id : [id]]);
};