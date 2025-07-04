import { Router } from 'express';
import { pool } from '../db/index.js';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middlewares/authMiddleware.js';
import jwt  from 'jsonwebtoken';


const router = Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;


    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try { 
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if ( result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials'});
        }

        const token = jwt.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({token});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get All Users Route
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Protected route - Get current user's info
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Comes from token 

        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE id = $1 ',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found '});
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;
