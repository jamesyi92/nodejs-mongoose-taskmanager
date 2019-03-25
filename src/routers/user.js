const express = require('express');
const User = require('../models/user');
const router = new express.Router();


router.post('/users', async (req, res) => {

  const newUser = new User(req.body);

  try {
    await newUser.save();
    res.status(201).send(newUser);
  } catch(e) {
    res.status(400).send(e);
  }

});

router.get('/users', async (req, res) => {

  try {
    const users = await User.find({});
    res.send(users);
  } catch(e) {
    res.status(500).send();
  };

});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if(!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch(e) {
    res.status(500).send();
  }

});


router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id;
  const userDataToUpdate = req.body;

  const allowedUpdates = [
    'name', 'email', 'password', 'age'
  ];
  const updates = Object.keys(userDataToUpdate);
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if(!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid updates!'
    })
  }

  try{
    const updatedUser = await User.findByIdAndUpdate(_id,userDataToUpdate, {
      new: true,
      runValidators: true
    });
    if(!updatedUser) {
      return res.status(404).send();
    }
    res.send(updatedUser);
  } catch(e) {
    res.status(400).send(e);
  }

});

router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try{
    const userToDelete = await User.findByIdAndDelete(_id);
    if(!userToDelete){
      return res.status(404).send();
    }
    res.send(userToDelete);
  } catch(e) {
    res.status(500).send();
  }

});

module.exports = router;