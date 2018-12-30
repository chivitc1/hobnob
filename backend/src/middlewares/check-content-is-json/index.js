function checkContentTypeIsJson(req, res, next) {
  console.log("checkContentTypeIsJson");
  console.log(req);
  if (!req.headers['content-type'].includes('application/json')) {

    console.log("checkContentTypeIsJson matched");
    res.status(415);
    res.set({'Content-Type': 'application/json'});
    res.json({message: 'The "Content-Type" header must always be "application/json"'});
    return;
  }
  next();
}

export default checkContentTypeIsJson;
