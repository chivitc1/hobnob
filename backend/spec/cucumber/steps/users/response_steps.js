import { Then, After, Status } from 'cucumber';
import assert, { AssertionError } from 'assert';
import { User } from './repository';

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