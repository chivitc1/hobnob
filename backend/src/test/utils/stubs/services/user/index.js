import { stub } from 'sinon';
import ValidationError from '../../../../../validators/errors/validation-error';

const CREATE_USER_RESPONSE = {
  id: "1",
  email: "user1@example.com"
};

const VALIDATION_ERROR_MSG = "ST wrong";
const GENERIC_ERROR_MSG = "Internal server error";

const generate = () => ({
  success: stub().resolves(CREATE_USER_RESPONSE),
  validationError: stub().rejects(new ValidationError(VALIDATION_ERROR_MSG)),
  genericError: stub().rejects(new Error(GENERIC_ERROR_MSG))
});

export {
  generate as default,
  VALIDATION_ERROR_MSG,
  GENERIC_ERROR_MSG,
  CREATE_USER_RESPONSE,
};