const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Sample User Object Structure: {"id": "1", "firstName": "Anshika", "lastName": "Agarwal", "hobby": "Teaching"}
let users = [
    { id: "1", firstName: "Anshika", lastName: "Agarwal", hobby: "Teaching" }
];

// Middleware to log request details
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    next();
});

// GET /users – Fetch the list of all users.
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// GET /users/:id – Fetch details of a specific user by ID.
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
});

// POST /user – Add a new user.
app.post('/user', (req, res) => {
    const { firstName, lastName, hobby } = req.body;
    
    // validation
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ error: 'Missing required fields: firstName, lastName, hobby' });
    }

    const newUser = {
        id: (users.length + 1).toString(), // Simple ID generation, not robust for production but fine for this demo
        firstName,
        lastName,
        hobby
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /user/:id – Update details of an existing user.
app.put('/user/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const { firstName, lastName, hobby } = req.body;
    
    // validation
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ error: 'Missing required fields: firstName, lastName, hobby' });
    }

    users[userIndex] = { ...users[userIndex], firstName, lastName, hobby };
    res.status(200).json(users[userIndex]);
});

// DELETE /user/:id – Delete a user by ID.
app.delete('/user/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    users.splice(userIndex, 1);
    res.status(204).send();
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
