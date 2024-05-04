const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// Endpoint to handle registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate input (e.g., check for empty fields)
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Read existing users from users.json file
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File doesn't exist, initialize users as an empty array
                const users = [];
                // Write an empty array to users.json file
                fs.writeFile('users.json', '[]', (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing users file:', writeErr);
                        return res.status(500).json({ error: 'Internal server error.' });
                    }
                    addUser(users);
                });
            } else {
                console.error('Error reading users file:', err);
                return res.status(500).json({ error: 'Internal server error.' });
            }
        } else {
            let users;
            try {
                users = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing users JSON:', parseError);
                return res.status(500).json({ error: 'Internal server error.' });
            }
            addUser(users);
        }
    });

    // Function to add a new user
    function addUser(users) {
      const userExists = users.find(user => user.username === username);
      if (userExists) {
          return res.status(400).json({ error: 'Username already exists.' });
      }
  
      // Hash the password before storing
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
              console.error('Error hashing password:', hashErr);
              return res.status(500).json({ error: 'Internal server error.' });
          }
          // Add favorites array with "" to the user object
          users.push({ username, password: hashedPassword, favorites: [] });
      
          fs.writeFile('users.json', JSON.stringify(users, null, 2), (writeErr) => {
              if (writeErr) {
                  console.error('Error writing users file:', writeErr);
                  return res.status(500).json({ error: 'Internal server error.' });
              }
              res.status(201).json({ message: 'Registration successful.' });
          });
      });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    let users;
    try {
      users = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing users JSON:', parseError);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    const user = users.find(user => user.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Compare hashed password
    bcrypt.compare(password, user.password, (compareErr, result) => {
      if (compareErr) {
        console.error('Error comparing passwords:', compareErr);
        return res.status(500).json({ error: 'Internal server error.' });
      }
      
      if (result) {
        // Passwords match, login successful
        res.status(200).json({ success: true, message: 'Login successful.' });
      } else {
        // Passwords don't match
        res.status(401).json({ success: false, error: 'Invalid username or password.' });
      }
    });
  });
});

app.listen(8081, () => {
    console.log(`Server is running on port 8081...`);
});
