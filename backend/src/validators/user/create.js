import ValidationError from '../errors/validation-error';

function validate(req) {
  if (!Object.prototype.hasOwnProperty.call(req.body, 'email')) {
    return new ValidationError("The 'email' field is missing");
  }

  if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) {
    return new ValidationError("The 'password' field is missing");
  }

  if (!_isValiEmail(req.body.email)) {
    return new ValidationError("The 'email' field must be a valid email");
  }

  // Default = no error
  return undefined;
}

function _isValiEmail(emailValue) {
  console.log("Check valid email");
  if (/^[\w.+]+@\w+\.\w+$/.test(emailValue))
    return true;
  console.log("Ivalid email: " + emailValue);
  return false;
}

export default validate;


