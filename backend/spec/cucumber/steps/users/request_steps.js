import { When } from 'cucumber';
import { getValidPayload } from './utils';
import superagent from 'superagent';

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

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
  this.request.unset(headerName);
});