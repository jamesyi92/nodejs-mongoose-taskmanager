const express = require('express');
const app = express();
const port = process.env.PORT;

// Connect to MongoDB
require('./db/mongoose');

// Models
const User = require('./models/user');
const Task = require('./models/task');

// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


// app.use((req, res, next) => {
//   if(req.method) {
//     res.status(503).send('Site is under maintence');
//   } else {
//     next();
//   }
// });


app.use(express.json());
// Register Routers
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
