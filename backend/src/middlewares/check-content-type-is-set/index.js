function checkContentTypeIsSet(req, res, next) {
  console.log("checkContentTypeIsSet");
  if (!req.headers['content-type'] && req.headers['content-length'] && req.headers['content-length'] !== 0) {
    console.log("checkContentTypeIsSet matched");
    res.status(400);
    res.set({'Content-Type': 'application/json'});
    res.json({message: 'The "Content-Type" header must be set for requests with a non-empty payload'});
    return;
  }
  next();
}

export default checkContentTypeIsSet;
