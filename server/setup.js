const mysql = require('mysql2');

const fs = require('fs');
const { exec } = require('child_process');
const prompt = require('prompt-sync')();

// Get user input
const DB_HOST = prompt('Enter MySQL host (default: localhost): ') || 'localhost';
const DB_PORT = prompt('Enter MySQL port (default: 3306): ') || '3306';
const DB_USER = prompt('Enter MySQL username (default: root): ') || 'root';
const DB_PASSWORD = prompt('Enter MySQL password: ');
// const DB_NAME = prompt('Enter your database name: ');
const DB_NAME = 'soundpilot';


const dumpFile = './database.sql';


const envContent = `DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}`;

fs.writeFileSync('.env', envContent);
console.log('.env file created successfully!');
fs.readFile(dumpFile, "utf-8", function (err, data) {
  if (err) {
    console.log("my error: " + err)
  }
  console.log(data)
})


const createDatabaseIfNotExists = () => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err, results) => {
      if (err) {
        console.error('Error creating database:', err);
        return;
      }
      console.log(`Database '${DB_NAME}' is ready.`);
      connection.end(); 
    });
  };

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  });

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
    
    createDatabaseIfNotExists();  
    setTimeout(dump, 100)
  });



const command = `mysql --binary-mode  -u ${DB_USER} -p ${DB_NAME} < ${dumpFile}`;

function dump() {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error applying MySQL dump:', stderr);
        } else {
            console.log('Database import successful!');
        }
    });
}
