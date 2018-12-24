import User from '../../models/user.model';
import ValidationError from '../../validators/errors/validation-error';
import validate from '../../validators/user/create'

function create(req) {
  const validationResult = validate(req);
  if (validationResult instanceof ValidationError) { 
    return Promise.reject(validationResult);
  }

  const createUserModel = new User(req.body);
  return createUserModel.save();
}

export default { create, };