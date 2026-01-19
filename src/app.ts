import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/test', (_req, res) => res.json({ message: 'Test OK' }));

export default app;