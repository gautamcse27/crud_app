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
    const { name, email, mobile,qualification, address, work_experience,achievement,remarks } = req.body;
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0]: null;

    if (!name || !email || !mobile || !qualification|| !address|| !work_experience|| !achievement || !remarks|| !req.files) {
        return res.status(400).json({ message: 'All fields (name, email, photo) are required.' });
      }
    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE mobile = $1',
            [mobile]
        );
        if (existingUser.rows.length>0){
            return res.status(400).json({error: 'Mobile Number already exists'})
        };


        const result = await pool.query(
            'INSERT INTO users (name, email, mobile, qualification, address, work_experience,achievement,remarks, photo, pdf) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9, $10) RETURNING *',
            [
                name, email, mobile,qualification, address, work_experience,achievement,remarks,
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

app.get('/users/search/:mobile', async (req, res) => {
    const mobile = req.params.mobile;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE mobile = $1', [mobile]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
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
app.put('/users/:id',upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), 
    async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, qualification, address, work_experience,achievement,remarks } = req.body;
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0]: null;
    if (mobile && !/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number format' });
    }


    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedName = name || existingUser.rows[0].name;
        const updatedEmail = email || existingUser.rows[0].email;
        const updatedMobile = mobile || existingUser.rows[0].mobile;
        const updateQualification= qualification || existingUser.rows[0].qualification;
        const updatedAddress = address || existingUser.rows[0].address;
        const updatedWork_experience= work_experience || existingUser.rows[0].work_experience;
        const updatedAchievement = achievement || existingUser.rows[0].achievement;
        const updatedRemarks = remarks  || existingUser.rows[0].remarks ;
        const updatedPhoto = photoFile ? photoFile.buffer.toString('base64') : existingUser.rows[0].photo;
        const updatedPdf = pdfFile ? pdfFile.buffer.toString('base64') : existingUser.rows[0].pdf;
        
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, mobile= $3, qualification=$4, address=$5, work_experience=$6,achievement=$7,remarks=$8, photo= COALESCE($9, photo), pdf= COALESCE($10, pdf)  WHERE id = $11 RETURNING *',
            [updatedName, updatedEmail,updatedMobile,updateQualification,updatedAddress,updatedWork_experience,updatedAchievement,updatedRemarks, updatedPhoto,updatedPdf, id]
        );
      
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
