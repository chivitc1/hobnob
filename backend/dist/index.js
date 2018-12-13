"use strict";

require("@babel/polyfill");

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

`
For POST and PUT requests, the body payload can be quite large. So, instead of
receiving the entire payload in one large chunk, it's better to consume it as a
stream of smaller units. The request object, req, that is passed into the
requestHandler function implements the ReadableStream interface. To extract the
request body of POST and PUT requests, we must listen for the data and end events
emitted from the stream.
`;

const requestHandler = function (req, res) {
  if (req.method === 'POST' && req.url === '/users') {
    const payloadData = [];
    req.on('data', data => {
      payloadData.push(data);
    });
    req.on('end', () => {
      //Handle empty payload
      if (payloadData.length === 0) {
        res.writeHead(400, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          message: 'Payload should not be empty'
        }));
        return;
      } // Handle unsupported media type


      if (req.headers['content-type'] !== 'application/json') {
        res.writeHead(415, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          message: 'The "Content-Type" header must always be "application/json"'
        }));
        return;
      } // Handle malformed json payload


      try {
        const bodyString = Buffer.concat(payloadData).toString();
        JSON.parse(bodyString);
      } catch (ex) {
        res.writeHead(400, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          message: 'Payload should be in JSON format'
        }));
      }
    });
    return;
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Hello, World!');
  }
};

const server = _http.default.createServer(requestHandler);

server.listen(8080);