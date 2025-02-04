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
    user: 'crud_user1',
    host: 'localhost',
    database: 'crud_app',
    password: 'crud@123',
    port: 5432,
});
const storage = multer.memoryStorage(); // Store file in memory as Buffer
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 5 * 1024 * 1024
    }
 });
// Routes
// Create a new user

app.post('/users',
    upload.fields([
        {name: 'photo', maxCount:1},
        {name: 'pdf', maxCount:1}
    ]),
     async (req, res) => {
    const { name, email, mobile } = req.body;
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0]: null;
    if (!mobile) {
        return res.status(400).json({ error: 'Mobile number is required' });
    }
    if (mobile) {
        // Check if mobile has exactly 10 digits
        if (!/^\d{10}$/.test(mobile)) {
            return res.status(400).json({ error: 'Mobile number must be 10 digits' });
        }
    }
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email,mobile,photo, pdf) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                name, email, mobile,
                 photoFile ? photoFile.buffer.toString('base64') : null,
                 pdfFile ? pdfFile.buffer.toString('base64'): null
                ]
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
        res.status(500).send('Server error ho gaya');
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
    const { name, email, mobile } = req.body;
    const photo = req.file ? req.file.buffer.toString('base64'):null;
    const pdf= req.file ?  req.file.buffer.toString('base64'): null;
    if (mobile && !/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number format' });
    }
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2,mobile= $3, photo= COALESCE($4, photo), pdf= COALESCE($5, pdf)  WHERE id = $6 RETURNING *',
            [name, email,mobile,photo,pdf, id]
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
