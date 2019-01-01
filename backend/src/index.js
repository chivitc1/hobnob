import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import checkEmptyPayLoad from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-is-json';
import handleErrors from './middlewares/error-handle';
import mongoose from 'mongoose';
import userCtrl from './controllers/users.controller';
import userService from './services/user';
import ValidationError from './validators/errors/validation-error';
import injectHandlerDependencies from './utils/inject-handler-dependenies';

/**
 * Connect to db
 */
const MONGO_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.DBNAME}`;
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${MONGO_URI}`)
});

/**
 * Dependencies injection mapping
 */
const handlerToServiceMap = new Map([[userCtrl.create, userService]]);

const app = express();

/**
 * Middleware handlers
 */
app.use(checkEmptyPayLoad);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);
app.use(bodyParser.json({ limit: 1e6 }));
app.post('/users', injectHandlerDependencies(userCtrl.create, handlerToServiceMap, ValidationError));
app.use(handleErrors);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at port ${process.env.SERVER_PORT}`)
});
