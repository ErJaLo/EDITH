import express from 'express';
import path from 'path';
import authRoutes from './api/auth';
import { verifyToken } from './middleware/auth';
import { AuthRequest } from './types/auth';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas públicas
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/test', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'test.html'));
});

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas protegidas (ejemplo)
app.get('/protected', verifyToken, (req: AuthRequest, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

export default app;