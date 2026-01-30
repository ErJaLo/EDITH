import { Router, Response } from 'express';
import { LoginRequest, AuthRequest } from '../types/auth';
import { 
  getUserByEmail, 
  verifyPassword, 
  generateToken, 
  createUser 
} from '../middleware/auth';

const router = Router();

/**
 * POST /auth/login
 * Autentica un usuario con email y password
 */
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id, user.email);
    res.json({ 
      token, 
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /auth/signup
 * Registra un nuevo usuario
 */
router.post('/signup', async (req, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const newUser = await createUser(email, password);
    const token = generateToken(newUser.id, newUser.email);
    
    res.status(201).json({ 
      token, 
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

/**
 * GET /auth/me
 * Obtiene los datos del usuario autenticado (requiere token)
 */
router.get('/me', (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ user: req.user });
});

export default router;
