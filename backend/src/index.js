import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import checkEmptyPayLoad from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-is-json';
import handleErrors from './middlewares/error-handle';
import validateInput from './validators/user';

import User from './models/user.model';
import mongoose from 'mongoose';

const MONGO_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.DBNAME}`;
mongoose.Promise = global.Promise;
console.log(MONGO_URI);
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${MONGO_URI}`)
});

const app = express();

app.use(checkEmptyPayLoad);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

app.use(bodyParser.json({ limit: 1e6 }));
app.use(validateInput);

app.post('/users', (req, res, next) => {    
  console.log("handle post /users: ");
  console.log(req.body);
  let newUserModel = new User(req.body);
  newUserModel.save()
    .then((data) => {
    console.log("CREATED USER: ");
    console.log(data);
    return res.status(201)
      .set('Content-Type', 'application/json')
      .json(data);
    
  }).catch((error) => {
    console.log(error);
    return res.status(500)
        .set('Content-Type', 'application/json')
        .json({message: err});
  });  

  
});

// Handling error
app.use(handleErrors);
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at port ${process.env.SERVER_PORT}`)
});
