const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

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
    let users = [];
    try {
        const usersData = fs.readFileSync('users.json', 'utf8');
        const data = JSON.parse(usersData);
        users = data.users;
    } catch (error) {
        console.error('Error reading users file:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }

    // Check if username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ error: 'Username already exists.' });
    }

    // Add new user to the list
    users.push({ username, password });

    // Write updated users list back to users.json file
    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
        res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
        console.error('Error writing users file:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(8081, () => {
    console.log(`Server is running on port 8081...`);
});
