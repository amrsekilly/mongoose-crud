var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected correctly to server");

  // create a new dish
  Dishes.create({
    name: 'Uthapizza',
    description: 'Test',
    comments: [{
      rating: 3,
      comment: 'This is insane',
      author: 'Matt Daemon'
    }]
  }, function(err, dish) {
    // the callback
    if (err) throw err;
    console.log('Dish created!');
    // to get the newly created dish info
    console.log(dish);

    // grab the id of the new dish
    var id = dish._id;

    // get all the dishes
    // the delay is used to learn about the modified date field
    setTimeout(function() {
      Dishes.findByIdAndUpdate(id, {
          $set: {
            description: 'Updated Test'
          }
        }, {
          new: true
        })
        .exec(function(err, dish) {
          // the callback
          if (err) throw err;
          console.log('Updated Dish!');
          console.log(dish);

          // insert a new comment into the comments array
          dish.comments.push({
            rating: 5,
            comment: 'I\'m getting a sinking feeling!',
            author: 'Leonardo di Carpaccio'
          });

          // save the modified dish to the DB
          dish.save(function(err, dish) {
            console.log('Updated Comments!');
            console.log(dish);

            db.collection('dishes').drop(function() {
              db.close();
            });
          });
        });
    }, 3000);
  });
});
