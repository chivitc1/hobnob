import assert from 'assert';
import userCtrl from '.';
import ValidationError from '../../validators/errors/validation-error';
import generateCreateUserStubs, { CREATE_USER_RESPONSE } from '../../test/utils/stubs/services/user';
import generateResSpy from '../../test/utils/spies/res';

describe('UserController create', function() {
  const req = {};
  let res;
  let createUser;

  beforeEach(function () {
    res = generateResSpy();
  });

  describe("When create resolves with the new user's ID", function() {
    beforeEach(function() {
      createUser = generateCreateUserStubs().success;
      
      return userCtrl.create(req, res, createUser, ValidationError);
      
    });
  
    describe('should call res.status()', function() {
      it('once', function() {
        assert(res.status.calledOnce);
      });

      it('with the argument 201', function () {
        assert(res.status.calledWithExactly(201));
      });
    });
  });

})
