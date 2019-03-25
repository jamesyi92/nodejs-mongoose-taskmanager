require('../src/db/mongoose');
const User = require('../src/models/user');


// User.findByIdAndUpdate('5c981620d99c2236c7561f9d', {
//   age: 99
// }).then(user => {
//   console.log(user);
//   return User.countDocuments({
//     age: 99
//   });
// }).then(users => {
//   console.log(users);
// }).catch(error => {
//   console.log(error);
// })

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, {
    age: age
  });
  const count = await User.countDocuments({
    age: age
  });
  return count;
}

updateAgeAndCount('5c97fcce1a9a7535f2fa59b1', 20)
  .then(result => {
    console.log(result);
  }).catch(error => {

  });