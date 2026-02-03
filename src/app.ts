import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './api/auth';
import { verifyToken } from './middleware/auth';
import { AuthRequest } from './types/auth';

const app = express();
app.use(express.json());

// Rutas públicas
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/test', (_req, res) => res.json({ message: 'Test OK' }));


app.use('/api', userRoutes);


// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas protegidas (ejemplo)
app.get('/protected', verifyToken, (req: AuthRequest, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

export default app;