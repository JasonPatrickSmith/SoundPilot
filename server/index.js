const express = require("express");
const app = express();
const cors = require('cors')
const port = 3000;
const mysql = require("mysql2");
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