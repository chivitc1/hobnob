function checkEmptyPayLoad(req, res, next) {
  console.log("checkEmptyPayLoad");
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.headers['content-length'] == 0) {
    console.log("checkEmptyPayLoad matched");
    res.status(400)
    res.set({'Content-Type': 'application/json'});
    res.json({message: 'Payload should not be empty'});
    return;
  }
  next();
}

export default checkEmptyPayLoad;