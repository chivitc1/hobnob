import { When, Then } from 'cucumber';
import superagent from 'superagent';

let request;
let result;
let error;
const API_URL = 'localhost:8080/users';

When('the client creates a POST request to /users', () => {
  request = superagent('POST', API_URL);
});

When('attaches a generic empty payload', () => undefined);

When('sends the request', (callback) => {
  request.then((response) => {
    result = response.res;
    callback();
  }).catch((errResponse) => {
    error = errResponse.response;
    callback();
  });
});

Then('our API should respond with a 400 HTTP status code', () => {
  if (error.statusCode !== 400) {
    throw new Error();
  }
});

Then('the payload of the respond should be a JSON object', () => {
  
});

Then('contains a message property which says "Payload should not be empty"', (callback) => {
  callback(null, 'pending');
});
