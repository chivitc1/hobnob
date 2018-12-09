import { When, Then } from 'cucumber'

When('the client creates a POST request to /users', (callback) => {
  callback(null, 'pending');
});

When('attaches a generic empty payload', (callback) => {
  callback(null, 'pending');
});

When('sends the request', (callback) => {
  callback(null, 'pending');
});

Then('our API should respond with a 400 HTTP status code', (callback) => {
  callback(null, 'pending');
});

Then('the payload of the respond should be a JSON object', (callback) => {
  callback(null, 'pending');
});

Then('contains a message property which says "Payload should not be empty"', (callback) => {
  callback(null, 'pending');
});
