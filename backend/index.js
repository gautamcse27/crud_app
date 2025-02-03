const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
// PostgreSQL connection
const pool = new Pool({
    user: 'crud_user',
    host: 'localhost',
    database: 'crud_app',
    password: 'crud@123',
    port: 5432,
});
const storage = multer.memoryStorage(); // Store file in memory as Buffer
const upload = multer({ storage });
// Routes
// Create a new user
app.post('/users', upload.single('photo'), async (req, res) => {
    const { name, email } = req.body;
    const mimeType = req.file.mimetype || 'image/jpeg';
    const photo = req.file? req.file.buffer.toString('base64') : null;

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email,photo) VALUES ($1, $2, $3) RETURNING *',
            [name, email, photo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error happened');
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update a user
app.put('/users/:id',upload.single('photo'), async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const photo = req.file ? req.file.buffer.toString('base64'):null;

    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, photo= COALESCE($3, photo)  WHERE id = $4 RETURNING *',
            [name, email,photo, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});