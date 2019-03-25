// CRUD create/read/update/delete

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database');
  }

  const db = client.db(databaseName);

  // db.collection('users').findOne({ _id: ObjectID('5c96d7f57abf7a304fd83ba3') }, (error, user) => {
  //   if (error) {
  //     console.log('User could not be fetched');
  //   }

  //   console.log(user);

  // });

  // db.collection('users').find({ age: 26 }).toArray((error, users) => {
  //   console.log(users);
  // });

  // db.collection('users').find({ age: 26 }).count((error, count) => {
  //   console.log(count);
  // });


  // db.collection('tasks').findOne({_id: new ObjectID('5c96d923553cd930567f5445')}, (error, task) => {
  //   if (error) {
  //     return console.log('could not fetch task');
  //   }

  //   console.log(task);
  // });

  // db.collection('tasks').find({ completed: false }).toArray((erorr, tasks) => {
  //   tasks.forEach((task) => {
  //     console.log(task);
  //   })
  // });

  // db.collection('users').updateOne(
  //   { 
  //     _id: new ObjectID('5c96d7f57abf7a304fd83ba2') 
  //   }, {
  //     $inc: {
  //       age: 1.5
  //     }
  //   }).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.log(err);
  //   })



  // db.collection('tasks').updateMany({
  //   completed: false
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }).then(res => {
  //   console.log(res);
  // }).catch(err => {
  //   console.log(err);
  // })

  // db.collection('users').deleteMany({
  //   age: 27.5
  // }).then(res => {
  //   console.log(res);
  // }).catch(err => {
  //   console.log(err);
  // })


  db.collection('tasks').deleteOne({
    description: 'Mow the lawn'
  }).then(res => {
    console.log('DELETED');
  }).catch(err => {
    console.log('LUL try again')
  });

});


