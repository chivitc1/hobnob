function validateInput(req, res, next) {
  console.log("validateInput");
  if (!Object.prototype.hasOwnProperty.call(req.body, 'email'))
     {
      console.log("validateInput matched");
      return res.status(400)
        .set('Content-Type', 'application/json')
        .json({ message: "The 'email' field is missing"});
    }
  if (!Object.prototype.hasOwnProperty.call(req.body, 'password'))
    {
     console.log("validateInput matched");
     return res.status(400)
       .set('Content-Type', 'application/json')
       .json({ message: "The 'password' field is missing"});
   }

  if (!isValiEmail(req.body.email)) {
    return res.status(400)
      .set('Content-Type', 'application/json')
      .json({ message: "The 'email' field must be a valid email"});
  }
  next();
}

function isValiEmail(emailValue) {
  console.log("Check valid email");
  if (/^[\w.+]+@\w+\.\w+$/.test(emailValue)) 
    return true;
  console.log("Ivalid email: " + emailValue);
  return false;
}

export default validateInput;
