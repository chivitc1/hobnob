function handleErrors(err, req, res, next) {
  console.log("handleErrors");
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
    console.log("handleErrors matched");
    res.status(400);
    res.set({'Content-Type': 'application/json'});
    res.json({ message: 'Payload should be in JSON format' }); 
    return;
  }

  next();
}

export default handleErrors;
