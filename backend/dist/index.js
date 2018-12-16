"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
`
For POST and PUT requests, the body payload can be quite large. So, instead of
receiving the entire payload in one large chunk, it's better to consume it as a
stream of smaller units. The request object, req, that is passed into the
requestHandler function implements the ReadableStream interface. To extract the
request body of POST and PUT requests, we must listen for the data and end events
emitted from the stream.
`;

function checkEmptyPayLoad(req, res, next) {
  console.log("checkEmptyPayLoad");

  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.headers['content-length'] == 0) {
    console.log("checkEmptyPayLoad matched");
    res.status(400);
    res.set({
      'Content-Type': 'application/json'
    });
    res.json({
      message: 'Payload should not be empty'
    });
    return;
  }

  next();
}

function checkContentTypeIsSet(req, res, next) {
  console.log("checkContentTypeIsSet");

  if (!req.headers['content-type'] && req.headers['content-length'] && req.headers['content-length'] !== 0) {
    console.log("checkContentTypeIsSet matched");
    res.status(400);
    res.set({
      'Content-Type': 'application/json'
    });
    res.json({
      message: 'The "Content-Type" header must be set for requests with a non-empty payload'
    });
    return;
  }

  next();
}

function checkContentTypeIsJson(req, res, next) {
  console.log("checkContentTypeIsJson");

  if (!req.headers['content-type'].includes('application/json')) {
    console.log("checkContentTypeIsJson matched");
    res.status(415);
    res.set({
      'Content-Type': 'application/json'
    });
    res.json({
      message: 'The "Content-Type" header must always be "application/json"'
    });
    return;
  }

  next();
}

function handleErrors(err, req, res, next) {
  console.log("handleErrors");

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
    console.log("handleErrors matched");
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
}

app.use(checkEmptyPayLoad);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);
app.use(_bodyParser.default.json({
  limit: 1e6
}));
app.post('/users', (req, res) => {
  console.log("handle post /users");
}); // Handling error

app.use(handleErrors);
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at port ${process.env.SERVER_PORT}`);
});