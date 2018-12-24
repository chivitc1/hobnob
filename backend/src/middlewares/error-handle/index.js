function handleErrors(err, req, res, next) {
  console.log("handleErrors");
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
    console.log("handleErrors matched");
    return res.status(400)
      .set({'Content-Type': 'application/json'})
      .json({ message: 'Payload should be in JSON format' });     
  }

  next();
}

export default handleErrors;
