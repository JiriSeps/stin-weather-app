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
        // Check if username already exists
        const userExists = users.find(user => user.username === username);
        if (userExists) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        // Add new user to the list
        users.push({ username, password });

        // Write updated users list back to users.json file
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing users file:', writeErr);
                return res.status(500).json({ error: 'Internal server error.' });
            }
            res.status(201).json({ message: 'Registration successful.' });
        });
    }
});

app.listen(8081, () => {
    console.log(`Server is running on port 8081...`);
});
