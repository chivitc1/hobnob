import userService from '../services/user';
import ValidationError from '../validators/errors/validation-error';

function create(req, res) {
  
  return userService.create(req)
    .then((result) => {
      res.status(201)
        .set('Content-Type', 'application/json')
        .json(result);
    }).catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(400)
          .set('Content-Type', 'application/json')
          .json({ message: err.message });
      }
      console.log("ERROR:");
      console.log(err);
      return res.status(500)
        .set('Content-Type', 'application/json')
        .json({ message: 'Internal Server Error' });
    })
}

export default { create, };
