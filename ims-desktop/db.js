const Datastore = require('nedb-promises');
const path = require('path');
const { app } = require('electron');

const userDB = Datastore.create({
  filename: path.join(app.getPath('userData'), 'users.db'),
  autoload: true,
});

// Insert default user once on first run (optional safety check)
userDB.count({}, (err, count) => {
  if (count === 0) {
    userDB.insert({ username: 'ruzte', password: '193910571' });
  }
});

module.exports = {
  userDB
};
