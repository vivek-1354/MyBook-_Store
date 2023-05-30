const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db; 

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://testUser:et9vEiaZldFyRHPV@cluster0.aofa9mr.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected!')
      _db = client.db()
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw err;
    });
}

const getDb = () => {
  if(_db) {
    return _db
  }
  throw 'No database found'
}
exports.mongoconnect = mongoConnect;
exports.getDb = getDb
