import User from '../models/user.model';
import validate from '../validators/user/create'
import ValidationError from '../validators/errors/validation-error';

function createUser(req, res) {
  const validationResult = validate(req);
  if (validationResult instanceof ValidationError) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({ message: validationResult.message });
  }

  const createUserModel = new User(req.body);
  createUserModel.save()
    .then((data) => {
    return res.status(201)
      .set('Content-Type', 'application/json')
      .json(data);
    
  }).catch((error) => {
    console.log(error);
    return res.status(500)
        .set('Content-Type', 'application/json')
        .json({message: err});
  });
}

export default { createUser, };