// NEED MONGOOSE TO TALK TO DATABASE
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs');

// THE SCHEMA THAT DEFINES HOW USER DATA IS FORMATTED
var userSchema = new Schema({
  created: { type: Date },
  updated: { type: Date },
  email: { type: String, unique: true, lowercase: true },
  // WHAT DOES SELECT MEAN?
  password: { type: String, select: false },
  displayName: String,
  // TODO #12
  picture: String
});

// PRE IS ANOTHER WORD FOR MIDDLEWARE
// BEFORE SAVING A NEW INSTANCE OF USER, THIS DEFINES THE DATE IT WAS
// CREATED AND IF IT GETS CREATED THEN INCLUDE THE UPDATED DATE
userSchema.pre('save', function (next) {
  // set created and updated
  now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }

  // encrypt password
  var user = this;
  // IF PASSWORD IS NOT MODIFIED, RETURN NEXT
  // NEXT COMES IN AS AN ARGUMENT
  // MONGOOSE IS KEEPING TRACK OF ITS WORKFLOW
  // NEXT IS TELLING MONGOOSE WHEN TO MOVE ON
  if (!user.isModified('password')) {
    return next();
  }
  // rounds - [OPTIONAL] - the number of rounds to process the data for. (default - 10)
  // callback - [REQUIRED] - a callback to be fired once the salt has been generated.
  // error - First parameter to the callback detailing any errors.
  // result - Second parameter to the callback providing the generated salt.
  // BASICALLY ENCRYPT PASSWORD
  bcrypt.genSalt(10, function (err, salt) {
    // HASH PASSWORD
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      next();
    });
  });
});

// COMPARE PASSWORDS
userSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
module.exports = User;
