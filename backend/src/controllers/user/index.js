function create(req, res, createUser, ValidationError) {
  return createUser(req)
    .then((result) => {
      res.status(201);
      res.set('Content-Type', 'application/json');
      res.json(result);
    }).catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400);
        res.set('Content-Type', 'application/json');
        res.json({ message: err.message });
        return res;
      }
      
      console.log("ERROR:"); 
      console.log(err);
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Internal Server Error' });
      return res;
    })
}

export default { create, };
