import { When, Then, BeforeAll, AfterAll, After, Status } from 'cucumber';
import superagent from 'superagent';
import assert, { AssertionError } from 'assert';
import { getValidPayload } from './utils';
import mongoose from 'mongoose';

var { setDefaultTimeout } = require('cucumber');
setDefaultTimeout(10 * 1000);

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
mongoose.connect(MONGO_URI, { useNewUrlParser: true });

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log("Mongoose default connection is disconnected due to application termination");
    process.exit(0);
  });
});

BeforeAll(function() {
  return User.deleteOne(function(err, result){
    if(err){
        throw err;
    } 
  });
});

AfterAll(function() {
  return User.deleteOne(function(err, result){
    if(err){
        throw err;
    } 
    mongoose.disconnect();
  });
});

When(/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/,
  function (method, path) {
    const processedPath = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}${path}`;
    this.request = superagent(method, processedPath);
  });
When(/^attaches a generic (.+) payload$/, function (payloadType) {
  switch (payloadType) {
    case 'malformed':
      this.request
        .send('{"key1": "value1", key2}')
        .set('Content-Type', 'application/json');
      break;
    case 'non-JSON':
      this.request
        .send('<?xml version="1.0" encoding="UTF-8" ?><email>user1@example.com</email>')
        .set('Content-Type', 'text/xml');
      break;
    case 'empty':
    //send nothing is a default behavior
    default:
  }
});

When(/^attaches a (.+) payload which is missing the (.+) fields?$/,
  function (payloadType, missingFields) {
    this.requestPayload = getValidPayload(payloadType);

    const fieldsToDelete = missingFields.split(',').map(s => s.trim()).filter(s => s === 'email' || s === 'password');

    fieldsToDelete.forEach(field => delete this.requestPayload[field]);

    this.request
      .send(JSON.stringify(this.requestPayload))
      .set('Content-Type', 'application/json');
  });

When(/^attaches a (.+) payload where the email field is exactly (.+)$/,
  function (payloadType, emailValue) {
    this.requestPayload = getValidPayload(payloadType);
    this.requestPayload['email'] = emailValue;
    this.request.send(JSON.stringify(this.requestPayload))
      .set('Content-Type', 'application/json');
  });

When(/^attaches a valid (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType);
  // console.log("payload: " + JSON.stringify(this.requestPayload));
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches (.+) as the payload$/, function(payload) {
  this.requestPayload = JSON.parse(payload);
  this.request.set('Content-Type', 'application/json')
    .send(payload);
});

When(/^attaches a Create User payload where the (.+) field is not a (.+)$/,
  function(fieldName, fieldType) {
  const payload = {
    email: "user@example.com",
    password: "password123"
  }
  for (var key in payload) {
    if (key == fieldName) {
      payload[key] = 123;
    }
  }
  // this.requestPayload = JSON.parse(payload);
  this.request.set('Content-Type', 'application/json').send(payload);
});

When(/^sends the request$/, function () {
  return this.request
    .then((response) => {
      this.response = response.res;
    }).catch((error) => {
      this.response = error.response;
    });
});

Then(/^the payload of the response should be an? ([a-zA-Z0-9, ]+)$/, function (payloadType) {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type']
  if (payloadType === 'JSON object') {
    if (!contentType || !contentType.includes('application/json')) {
      throw new AssertionError({ message: 'Response not of content-type application/json' });
    }

    try {
      return this.responsePayload = JSON.parse(this.response.text);
    } catch (err) {
      throw new AssertionError({ message: 'Response not a valid JSON object' });
    }
  }

  throw new AssertionError({ message: 'Response not a valid JSON object' });
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
  this.request.unset(headerName);
});

Then(/^the user object should be added to the database$/,
  function () {
    this.userId = this.responsePayload._id;
    return User.findById(this.userId)
      .then((data) => {
        if (!data) {
          throw new AssertionError({ message: "User object not added to database" });
        }

        assert.deepStrictEqual(data._id + '', this.userId)
      })
      .catch((err) => {
        console.log("ERROR: ");
        console.log(err);
      });

  });

  After(function (scenario) {
    if (scenario.result.status === Status.PASSED) {
      return User.deleteOne(function(err){
        if(err){
            throw err;
        }
      });
    }
  });