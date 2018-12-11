import { When, Then } from 'cucumber';
import superagent from 'superagent';
import assert from 'assert'

let API_URL = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`;

When('the client creates a POST request to /users', function() {
  console.log("API: " + API_URL);
  this.request = superagent('POST', API_URL);
});
When('attaches a generic empty payload', () => undefined);

When('sends the request', function(callback) {
  this.request.then((response) => {
    this.response = response.res;
    callback();
  }).catch((error) => {
    this.response = error.response;
    callback();
  });
});

Then('our API should respond with a 400 HTTP status code', function() {
  if (this.response.statusCode !== 400) {
    assert.equal(this.response.statusCode, 400)
  }
});

Then('the payload of the respond should be a JSON object', function() {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type']
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response not of content-type application/json');
  }

  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (err) {
    console.log("ERROR: " + err)
    throw new Error('Response not a valid JSON object');
  }
});

Then('contains a message property which says "Payload should not be empty"', function() {
  if (this.responsePayload.message !== 'Payload should not be empty') {
    assert.equal(this.responsePayload.message, 'Payload should not be empty')
  }
});
