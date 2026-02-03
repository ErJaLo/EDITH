import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        if (user) res.status(200).json(user);
        else res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await userService.updateUser(id, req.body);
        if (user) res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
        else res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
};