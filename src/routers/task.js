const express = require('express');
const router = new express.Router();
const Task = require('../models/task');



router.post('/tasks', async (req, res) => {

  const task = new Task(req.body);

  try{
    const savedTask = await task.save();
    res.status(201).send(savedTask);
  } catch(e) {
    res.status(400).send(e);
  }


});

router.get('/tasks', async (req, res) => {

  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch(e) {
    res.status(500).send(e);
  }

})

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    res.send(task);
  } catch(e) {
    res.status(500).send();
  }

});

router.patch('/tasks/:id', async (req, res) => {

  const _id = req.params.id;
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
    const updatedTask = await Task.findByIdAndUpdate(_id, taskDataToUpdate, {
      new: true,
      runValidators: true
    });
    if(!updatedTask) {
      return res.status(404).send();
    }
    res.send(updatedTask);
  } catch(e) {
    res.status(400).send();
  }

});

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try{
    const taskToDelete = await Task.findByIdAndDelete(_id);
    if(!taskToDelete) {
      return res.status(404).send({
        error: 'Task does not exist'
      });
    }
    res.send(taskToDelete);
  } catch(e) {
    res.status(500).send();
  }

});


module.exports = router;


