import ValidationError from '../errors/validation-error';
import Ajv from 'ajv';
import profileSchema from '../../schemas/user/profile.json';
import createUserSchema from '../../schemas/user/create.json';
import generateValidationErrorMessage from '../errors/messages';

function validate(req) {

  //new Ajv({allErrors: true})
  // default single error capture
  const ajvValidate = new Ajv()
    .addFormat('email', /^[\w.+]+@\w+\.\w+$/)
    .addSchema([profileSchema, createUserSchema])
    .compile(createUserSchema);
  const valid = ajvValidate(req.body);

  if (!valid) {
    return new ValidationError(generateValidationErrorMessage(ajvValidate.errors));
  }

  return true;
}

export default validate;
