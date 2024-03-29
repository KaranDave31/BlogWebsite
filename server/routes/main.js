const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
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



module.exports = router;