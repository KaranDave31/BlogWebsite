const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@kd',
    database: 'blogDatabase'
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });

  router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    const locals = {
        title: "Panner Posting"
    };
    res.render('index', { layout: false, locals });
});


router.get('/signup',(req,res) => {
    res.render('signup', { layout: false});
});

router.post('/signup', (req, res) => {
    const { username, email, password, full_name } = req.body;
  
    // Insert user data into MySQL
    const query = 'INSERT INTO Users (username, email, password, full_name) VALUES (?, ?, ?, ?)';
    connection.query(query, [username, email, password, full_name], (error, results, fields) => {
      if (error) {
        console.error('Error inserting user data: ' + error.stack);
        res.status(500).send('Error saving user data');
        return;
      }
      console.log('User signed up successfully');
      res.redirect('/signup-success'); // Redirect to a success page or any other page you prefer
    });
  });


router.get('/blog',(req,res) => {
    res.render('blog');
});

router.get('/myprofile',(req,res) => {
    res.render('myprofile');
});




module.exports = router;