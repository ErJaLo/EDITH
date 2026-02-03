import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/test', (_req, res) => res.json({ message: 'Test OK' }));


app.use('/api', userRoutes);


export default app;