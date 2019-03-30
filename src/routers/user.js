const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');


router.post('/users', async (req, res) => {

  const newUser = new User(req.body);

  try {
    await newUser.save();
    sendWelcomeEmail(newUser.email, newUser.name);
    const token = await newUser.generateAuthToken();
    res.status(201).send({ 
      user: newUser, 
      token 
    });
  } catch(e) {
    res.status(400).send(e);
  }

});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    })

    await req.user.save();

    res.send();
  } catch(e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try{
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch(e) {
    res.status(500).send();
  }
});

router.post('/users/login', async (req, res) => {

  const userData = req.body;

  try {
    const user = await User.findByCredentials(userData.email, userData.password);
    const token = await user.generateAuthToken();
    res.send({
      user,
      token
    });
  } catch(e) {
    res.status(400).send();
  }
});


router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
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


router.patch('/users/me', auth, async (req, res) => {

  const _id = req.user._id;
  const user = req.user;

  const allowedUpdates = [
    'name', 'email', 'password', 'age'
  ];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if(!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid updates!'
    })
  }

  try{

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();

    res.send(user);
  } catch(e) {
    res.status(400).send(e);
  }

});

router.delete('/users/me', auth, async (req, res) => {

  const _id = req.user._id;

  try{
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch(e) {
    res.status(500).send();
  }
});

const upload = multer({
  // dest: './avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {

    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload a jpg, jpeg or a png'));
    }

    cb(undefined, true);
  }
})

router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 300 }).png().toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
  res.status(400).send({
    error: error.message
  })
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if(!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/jpg');

    res.send(user.avatar);

  } catch(e) {
    res.status(404).send();
  }
});

module.exports = router;