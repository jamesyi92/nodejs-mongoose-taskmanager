const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');



router.post('/tasks', auth, async (req, res) => {

  //const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try{
    const savedTask = await task.save();
    res.status(201).send(savedTask);
  } catch(e) {
    res.status(400).send(e);
  }


});

// GET /tasks?completed=true or false
// for pagination: limit + skip
// GET /tasks?limit=10&skip=20
// for sorting data
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {

  const tasksCriteria = {
    owner: req.user._id
  }

  const tasksLimit = parseInt(req.query.limit);
  const tasksSkip = parseInt(req.query.skip);
  const tasksSort = {};

  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    tasksSort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  if(req.query.completed) {
    tasksCriteria.completed = req.query.completed === 'true';
  }

  try {
    const tasks = await Task.find(tasksCriteria)
      .limit(tasksLimit)
        .skip(tasksSkip)
          .sort(tasksSort);

    res.send(tasks);
  } catch(e) {
    res.status(500).send(e);
  }

})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    //const task = await Task.findById(_id);
    const task = await Task.findOne({
      _id,
      owner: req.user._id
    })
    if(!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch(e) {
    res.status(404).send();
  }

});

router.patch('/tasks/:id', auth, async (req, res) => {


  //const _id = req.params.id;
  const taskDataToUpdate = req.body;

  const allowedUpdates = ['description', 'completed'];
  const updates = Object.keys(taskDataToUpdate);

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if(!isValidOperation) {
    res.status(400).send({
      error: 'Entered an unidentified property in the model'
    })
  }

  try{
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if(!task) {
      return res.status(404).send();
    }

    updates.forEach(update => {
      task[update] = taskDataToUpdate[update];
    });

    await task.save();

    res.send(task);
  } catch(e) {
    res.status(400).send();
  }

});

router.delete('/tasks/:id', auth, async (req, res) => {


  try{
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })
    if(!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch(e) {
    res.status(500).send();
  }

});


module.exports = router;


