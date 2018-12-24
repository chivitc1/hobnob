"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _checkEmptyPayload = _interopRequireDefault(require("./middlewares/check-empty-payload"));

var _checkContentTypeIsSet = _interopRequireDefault(require("./middlewares/check-content-type-is-set"));

var _checkContentIsJson = _interopRequireDefault(require("./middlewares/check-content-is-json"));

var _errorHandle = _interopRequireDefault(require("./middlewares/error-handle"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _users = _interopRequireDefault(require("./controllers/users.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MONGO_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.DBNAME}`;
_mongoose.default.Promise = global.Promise;

_mongoose.default.connect(MONGO_URI, {
  useNewUrlParser: true
});

_mongoose.default.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${MONGO_URI}`);
});

const app = (0, _express.default)();
app.use(_checkEmptyPayload.default);
app.use(_checkContentTypeIsSet.default);
app.use(_checkContentIsJson.default);
app.use(_bodyParser.default.json({
  limit: 1e6
}));
app.post('/users', _users.default.createUser);
app.use(_errorHandle.default);
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at port ${process.env.SERVER_PORT}`);
});