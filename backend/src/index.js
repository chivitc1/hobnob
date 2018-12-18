import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import checkEmptyPayLoad from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-is-json';
import handleErrors from './middlewares/error-handle';
import validateInput from './validators/user';

const app = express();

app.use(checkEmptyPayLoad);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

app.use(bodyParser.json({ limit: 1e6 }));
app.use(validateInput);

app.post('/users', (req, res) => {    
  console.log("handle post /users");
});

// Handling error
app.use(handleErrors);
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at port ${process.env.SERVER_PORT}`)
});
