import { When, Then } from 'cucumber';
import superagent from 'superagent';
import assert from 'assert'
import { getValidPayload } from './utils'

const API_URL = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`;
console.log("API: " + API_URL);

When(/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/, 
  function(method, path) {  
    const processedPath = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}${path}`;
    this.request = superagent(method, processedPath);
});
When(/^attaches a generic (.+) payload$/, function(payloadType) {
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
  function(payloadType, missingFields) {
    this.requestPayload = getValidPayload(payloadType);

    const fieldsToDelete = missingFields.split(',').map(s => s.trim()).filter(s => s === 'email' || s === 'password');

    fieldsToDelete.forEach(field => delete this.requestPayload[field]);

    console.log(this.requestPayload);
    this.request
      .send(JSON.stringify(this.requestPayload))
      .set('Content-Type', 'application/json');
});

When(/^attaches a (.+) payload where the email field is exactly (.+)$/, 
  function(payloadType, emailValue) {
    this.requestPayload = getValidPayload(payloadType);
    this.requestPayload['email'] = emailValue;
    console.log("payload: " + JSON.stringify(this.requestPayload));
    this.request.send(JSON.stringify(this.requestPayload))
      .set('Content-Type', 'application/json');
});

When(/^attaches a valid (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType);
  this.request
  .send(JSON.stringify(this.requestPayload))
  .set('Content-Type', 'application/json');
  });

When(/^sends the request$/, function(callback) {
  this.request.then((response) => {
    this.response = response.res;
    callback();
  }).catch((error) => {
    this.response = error.response;
    callback();
  });
});

Then(/^the payload of the response should be an? ([a-zA-Z0-9, ]+)$/, function(payloadType) {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type']
  if (payloadType === 'JSON object') {
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response not of content-type application/json');
    }
  }  

  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (err) {
    console.log("ERROR: " + err)
    throw new Error('Response not a valid JSON object');
  }
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function(statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function(headerName) {
  this.request.unset(headerName);
});