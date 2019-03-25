require('../src/db/mongoose');
const Task = require('../src/models/task');


//5c9813f31810113684fbf4af


// Task.findByIdAndDelete('5c9827cb2f77df37996183a4')
//   .then(task => {
//     return Task.find({
//       completed: false
//     });
//   }).then(tasks => {
//     console.log(tasks);
//   }).catch(error => {
//     console.log(error);
//   })


const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({
    completed: false
  });

  return count;
}

deleteTaskAndCount('5c9827cd2b6be9379bdaf6c7')
  .then(result => {
    console.log(result);
  }).catch(error => {
    console.log(error);
  });