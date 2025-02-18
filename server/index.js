const express = require("express");
const app = express();
const cors = require('cors')
const port = 3000;
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const { receiveMessageOnPort } = require("worker_threads");


app.use(cors())

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'HulkBuster658',
    database: 'strumpilot'
  });

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL: " + err.stack)
        return;
    }
    console.log('Connected to MySQL as ID ' + connection.threadId);
})

app.get('/assignments', (req, res) => {
    const recieved = req.query.id
    connection.query(`SELECT * FROM assignments WHERE student_id = ${recieved}`, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error fetching assignments')
            return;
        }
        res.json(results)
    })
    // res.json({message: recieved.toString()});
})

app.get('/assignments/details', (req, res) => {
    const recieved = req.query.id
    connection.query(`SELECT * FROM assignments WHERE student_id = ${recieved}`, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error fetching assignments')
            return;
        }
        res.json(results)
    })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // The folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // File name generation
    }
});

const upload = multer({ storage: storage });

app.post("/submission", upload.single("file"),(req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    res.send({ message: "File uploaded successfully", file: req.file });
})