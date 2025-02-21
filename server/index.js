require('dotenv').config();


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
    host: process.env.DB_HOST.toString(),
    user: process.env.DB_USER.toString(),
    password: process.env.DB_PASSWORD.toString(),
    database: process.env.DB_NAME.toString()
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
    VALUES (?, ?, ?, NOW(), "");
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


app.use(express.json());

app.post("/feedback", (req, res) => {
    const body = req.body
    
    var values = [
        body.feedback,
        body.submission_id
    ]

    console.log(body)

    const query = `
    UPDATE submissions
    SET feedback = ?
    WHERE id = ?`

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error assigning')
            return;
        }
        res.json(results)
    })
})

app.use(express.json());

app.post('/noteidentifying', (req, res) => {
    const body = req.body
    console.log(body)
    res.json({ message: 'Received' })

    const query = `
    INSERT INTO note_identifying_sessions (user_id, correct_guesses, wrong_guesses, start_time, end_time, duration_seconds, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
    `

    const values = [
        body.user_id,
        body.rightNotes,
        body.wrongNotes,
        body.startTime.slice(0, 19).replace('T', ' '),
        body.endTime.slice(0, 19).replace('T', ' '),
        body.duration,
    ]

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error assigning')
            return;
        }
        res.json(results)
    })
})

app.get('/noteidentifying', (req, res) => {
    const id = req.query.id

    connection.query(`SELECT * FROM note_identifying_sessions WHERE user_id = ${id}`, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error fetching assignments')
            return;
        }
        res.json(results)
    })
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/uploads', (req, res) => {

    
    const path1 = req.query.path
    const pathAdded = path.join(__dirname, path1)
    res.sendFile(pathAdded, (err) => {
      });
})

app.post('/deleteAssignment', (req, res) => {
    const body = req.body

    const query = `DELETE FROM assignments WHERE id=${body.id}`

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack)
            res.status(500).send('Error assigning')
            return;
        }
        res.json(results)
    })
})