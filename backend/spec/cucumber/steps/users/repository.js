import mongoose from 'mongoose';

const MONGO_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.DBNAME}`;
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${MONGO_URI}`)
});

if (!(mongoose.connection.readyState == 1)) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true });
}

function closeResource(callback) {
  mongoose.disconnect();
  if (callback) {
    callback();
  }  
}

export { User, closeResource };