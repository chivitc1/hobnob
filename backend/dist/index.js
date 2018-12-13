"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
app.use(_bodyParser.default.json({
  limit: 1e6
}));
`
For POST and PUT requests, the body payload can be quite large. So, instead of
receiving the entire payload in one large chunk, it's better to consume it as a
stream of smaller units. The request object, req, that is passed into the
requestHandler function implements the ReadableStream interface. To extract the
request body of POST and PUT requests, we must listen for the data and end events
emitted from the stream.
`;
app.post('/users', (req, res) => {
  //Handle empty payload
  if (req.headers['content-length'] == 0) {
    res.status(400);
    res.set({
      'Content-Type': 'application/json'
    });
    res.json({
      message: 'Payload should not be empty'
    });
    return;
  } // Handle code 415


  if (req.headers['content-type'] !== 'application/json') {
    res.status(415);
    res.set({
      'Content-Type': 'application/json'
    });
    res.json({
      message: 'The "Content-Type" header must always be "application/json"'
    });
    return;
  }
}); // Handling error

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
    // Handle malformed json payload
    res.status(400);
    res.set({
      'Content-Type': 'application/json'
    });
    res.json({
      message: 'Payload should be in JSON format'
    });
    return;
  }

  next();
});
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at port ${process.env.SERVER_PORT}`);
});