import { Router } from 'express';
import { pool } from '../db/index.js';


const router = Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Signup failed' });
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

export default router;
