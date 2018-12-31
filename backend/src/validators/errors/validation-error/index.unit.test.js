import ValidationError from '.';
import assert from 'assert';

describe('ValidationError', function() {
  it('should be a subclass of Error', function() {
    const validateError = new ValidationError();
    assert.equal(validateError instanceof Error, true);
  });

  it('should make the constructor parameter accessible via the `message` property of the instance', function() {
    const TEST_ERROR = 'TEST ERROR';
    const validateError = new ValidationError(TEST_ERROR);
    assert.equal(validateError.message, TEST_ERROR);
  })
})
