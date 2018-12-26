import ValidationError from '../errors/validation-error';
import Ajv from 'ajv';
import profileSchema from '../../schemas/user/profile.json';
import createUserSchema from '../../schemas/user/create.json';


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

function generateValidationErrorMessage(errors){
  const error = errors[0];
  if (error.keyword === 'required') {
    return `The '${error.dataPath}.${error.params.missingProperty}' field is missing`;
  }

  if (error.keyword === 'type') {
    return `The '${error.dataPath}' field must be of ${error.params.type}`;
  }

  if (error.keyword === 'format') {
    return `The '${error.dataPath}' field must be a valid ${error.params.format}`;
  }

  if (error.keyword === 'additionalProperties') {
    return `The '${errror.dataPath}' object does not support the field '${error.params.additionalProperty}'`;
  }

  return 'The object is invalid';
}

export default validate;


