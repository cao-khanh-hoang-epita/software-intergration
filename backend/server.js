const express = require('express');
const cors = require('cors'); // Ensure CORS middleware is installed

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes, adjust options as necessary

// Routes
const usersRouter = require('./src/routes/users.route'); // Adjust path as necessary
app.use('/users', usersRouter); // Mount the usersRouter middleware at /users

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
