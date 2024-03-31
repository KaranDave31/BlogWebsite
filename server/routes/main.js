const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
// const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');



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
  const { username, email, password, fullname } = req.body;

  // Check if the email has been used more than 5 times
  connection.query('SELECT COUNT(*) AS emailCount FROM Users WHERE email = ?', [email], (error, results) => {
      if (error) {
          console.error('Error checking email count:', error);
          res.status(500).send('Error checking email count');
          return;
      }

      const emailCount = results[0].emailCount;

      if (emailCount >= 5) {
          res.status(400).send('This email has been used too many times. Please use a different email.');
          return;
      }

      // Insert user data into MySQL
      const query = 'INSERT INTO Users (username, email, password, full_name) VALUES (?, ?, ?, ?)';
      connection.query(query, [username, email, password, fullname], (insertError, insertResults, insertFields) => {
          if (insertError) {
              console.error('Error inserting user data:', insertError);
              res.status(500).send('Error saving user data');
              return;
          }
          console.log('User signed up successfully');
          res.redirect('/signup-success'); // Redirect to a success page or any other page you prefer
      });
  });
});

  router.get('/blog',(req,res) => {
    connection.query('SELECT title, content, author FROM Posts', (error, results, fields) => {
        if (error) {
            console.error('Error retrieving posts:', error);
            res.status(500).send('Error retrieving posts');
            return;
        }
        res.render('blog', { posts: results, layout: false }); // Merge the objects and pass them to res.render
    });
});





router.get('/posting',(req,res) => {
  res.render('posting', { layout: false});
});

router.post('/posting', (req, res) => {
  const { postTitle, postContent, authorName } = req.body;

  if (!postContent) {
      return res.status(400).send('Content cannot be empty');
  }

  // Insert the new post into the database
  const query = 'INSERT INTO Posts (title, content, author) VALUES (?, ?, ?)';
  connection.query(query, [postTitle, postContent, authorName], (error, results, fields) => {
      if (error) {
          console.error('Error creating post:', error);
          return res.status(500).send('Error creating post');
      }
      console.log('Post created successfully');

      // Redirect to the blog page
      res.redirect('/blog'); // Assuming '/blog' is the route for the blog page
  });
});



router.get('/myprofile',(req,res) => {
  
    res.render('myprofile', { layout: false});
});

router.post('/search', (req, res) => {
  const searchQuery = req.body.searchQuery;

  // Query the database for matching results
  const query = `SELECT * FROM Posts WHERE title LIKE '%${searchQuery}%' OR author LIKE '%${searchQuery}%'`;
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error searching posts:', error);
          res.status(500).send('Error searching posts');
          return;
      }
      // Render a new webpage with the matching results
      res.render('search-results', { results: results ,layout: false});
  });
});


router.get('/membership',(req,res) => {
   res.render('membership', { layout: false});
});

router.post('/payment', (req, res) => {
  const { name, card_details, password, plan } = req.body;

  // Insert payment data into MySQL
  const query = 'INSERT INTO payment (name, cardNum, password, plan) VALUES (?, ?, ?, ?)';
  connection.query(query, [name, card_details, password, plan], (error, results) => {
    if (error) {
      console.error('Error inserting payment data:', error);
      res.status(500).send('Error processing payment');
      return;
    }
    console.log('Payment processed successfully');

    // Redirect to payment success page
    res.redirect('/payment-success');
  });
});



router.get('/aboutus',(req,res) => {
  res.render('aboutus', { layout: false});
});

router.get('/payment-success',(req,res) => {
  res.render('payment-success', { layout: false});
});


router.get('/policy',(req,res) => {
  res.render('policy', { layout: false});
});

router.get('/indexMain',(req,res) => {
  res.render('indexMain', { layout: false});
});


router.get('/tutorial',(req,res) => {
  res.render('tutorial', { layout: false});
});

router.get('/login',(req,res) => {
  res.render('login', { layout: false});
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to fetch the user's information
  connection.query('SELECT * FROM Users WHERE username = ?', [username], (error, results) => {
      if (error) {
          console.error('Error fetching user:', error);
          res.status(500).send('Internal Server Error');
          return;
      }

      // Check if the user exists
      if (results.length === 0) {
          res.status(401).send('Invalid username or password');
          return;
      }

      const user = results[0];

      // Compare the provided password with the one stored in the database
      if (password === user.password) {
          // Redirect to indexMain.ejs after a short delay
          setTimeout(() => {
            res.redirect(`/indexMain?login=success&username=${user.username}`);
          }, 1000);
      } else {
          res.status(401).send('Invalid username or password');
      }
  });
});



module.exports = router;