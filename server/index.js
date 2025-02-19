const express = require("express");
const app = express();
const cors = require('cors')
const port = 3000;
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const { receiveMessageOnPort } = require("worker_threads");

const defaultstudent = 1
const defaultteacher = 2


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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // The folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // File name generation
    }
});

const upload = multer({ storage: storage });



app.get('/submissions', (req, res) => {
    const recieved = req.query.id
    connection.query(`SELECT * FROM submissions WHERE assignment_id = ${recieved}`, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error fetching assignments')
            return;
        }
        res.json(results)
    })
    // res.json({message: recieved.toString()});
})

app.post("/submission", upload.single("file"),(req, res) => {
    // if (!req.file) {
    //     return res.status(400).send("No file uploaded.");
    // }
    // res.send({ message: "File uploaded successfully", file: req.file });
    const file = req.file
    
    const submission_data = JSON.stringify({
        "file" : req.file.path,
        "type" : req.body.submission_type
    });

    const values = [
        req.body.assignment_id,
        defaultstudent,
        submission_data
    ]

    const query = `
    INSERT INTO submissions (assignment_id, student_id, submission_data, submitted_at, feedback)
    VALUES (?, ?, ?, NOW(), "feedback");
    `

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error fetching assignments')
            return;
        }
        res.json(results)
    })
})

app.post('/assign', upload.single("file"), (req, res) => {
    const file = req.file

    

    const body = req.body

    const details = JSON.stringify({
        "attachment" : req.file.path,
        "description" : body.desc
    });

    const values = [
        defaultteacher,
        defaultstudent,
        body.title,
        "attachment",
        body.date,
        body.shortdesc, 
        details,
        body.type
    ]

    const query = `
    INSERT INTO assignments (teacher_id, student_id, title, type, due_date, created_at, updated_at, short_desc, details, type_given)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?);
    `

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error assigning')
            return;
        }
        res.json(results)
    })
})