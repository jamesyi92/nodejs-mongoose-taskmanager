const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
require('./db/mongoose');

// Models
const User = require('./models/user');
const Task = require('./models/task');

// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// Register Routers
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

