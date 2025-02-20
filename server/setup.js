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
const DB_NAME = 'strumpilot';

// MySQL dump file
const dumpFile = './database.sql';

// Generate .env file
const envContent = `DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}`;

fs.writeFileSync('.env', envContent);
console.log('.env file created successfully!');


const createDatabaseIfNotExists = () => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err, results) => {
      if (err) {
        console.error('Error creating database:', err);
        return;
      }
      console.log(`Database '${DB_NAME}' is ready.`);
      connection.end(); // Close the connection after creating the database
    });
  };

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your MySQL username
    password: 'HulkBuster658'  // Replace with your MySQL password
  });

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
    
    createDatabaseIfNotExists();  // Call the function to create the database
    setTimeout(dump, 100)
  });


// Apply MySQL dump
const command = `mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${dumpFile}`;

function dump() {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error applying MySQL dump:', stderr);
        } else {
            console.log('Database import successful!');
        }
    });
}
