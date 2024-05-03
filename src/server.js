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

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                const users = [];
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

    function addUser(users) {
        const userExists = users.find(user => user.username === username);
        if (userExists) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        users.push({ username, password });

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
