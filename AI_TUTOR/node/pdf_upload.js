const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');

const app = express();
const PORT = 4001;

// Middleware
app.use(cors());
app.use(express.json()); // Add to parse JSON body
app.use('/uploads', express.static('uploads'));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Change this if your MySQL server is hosted elsewhere
  user: 'abi', // Replace with your MySQL username
  password: 'abi', // Replace with your MySQL password
  database: 'ai_tutor', // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});
var fileId = '';

// Set up storage with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Ensure the uploads folder exists
  },
  filename: (req, file, cb) => {
     fileId = Date.now().toString(); // Generate a unique ID for the file
    cb(null, fileId + path.extname(file.originalname)); // Append the extension
  },
});

const upload = multer({ storage: storage });

// Upload route
app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const filePath = req.file.path; // Full path of the uploaded file
  const email = req.body.email; // Assuming email is sent in the form data
  const fileName = req.body.fileName; // Use the original filename from the uploaded file

  // Store file details in the database
  const query = 'INSERT INTO files (file_id, file_name, email) VALUES (?, ?, ?)';
  const values = [fileId, fileName, email];
  console.log(values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database insertion error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Return a JSON response
    res.json({
      message: 'File uploaded successfully',
      fileId: fileId,
      filePath: filePath,
    });
  });
});

// New route to get files by email
app.post('/files', (req, res) => {
  const email = req.body.email; // Get the email from the request body
  console.log(email);
  // SQL query to select file ID and filename based on the provided email
  const query = 'SELECT file_id, file_name FROM files WHERE email = ?';
  const values = [email];
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    console.log(results);
    // Return the results as a JSON response
    res.json({
      files: results,
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});