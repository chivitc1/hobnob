"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _checkEmptyPayload = _interopRequireDefault(require("./middlewares/check-empty-payload"));

var _checkContentTypeIsSet = _interopRequireDefault(require("./middlewares/check-content-type-is-set"));

var _checkContentIsJson = _interopRequireDefault(require("./middlewares/check-content-is-json"));

var _errorHandle = _interopRequireDefault(require("./middlewares/error-handle"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("./controllers/user"));

var _user2 = _interopRequireDefault(require("./services/user"));

var _validationError = _interopRequireDefault(require("./validators/errors/validation-error"));

var _injectHandlerDependenies = _interopRequireDefault(require("./utils/inject-handler-dependenies"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Connect to db
 */
const MONGO_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.DBNAME}`;
_mongoose.default.Promise = global.Promise;

_mongoose.default.connect(MONGO_URI, {
  useNewUrlParser: true
});

_mongoose.default.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${MONGO_URI}`);
});
/**
 * Dependencies injection mapping
 */


const handlerToServiceMap = new Map([[_user.default.create, _user2.default]]);
const app = (0, _express.default)();
/**
 * Middleware handlers
 */

app.use(_checkEmptyPayload.default);
app.use(_checkContentTypeIsSet.default);
app.use(_checkContentIsJson.default);
app.use(_bodyParser.default.json({
  limit: 1e6
}));
app.post('/users', (0, _injectHandlerDependenies.default)(_user.default.create, handlerToServiceMap, _validationError.default));
app.use(_errorHandle.default);
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at port ${process.env.SERVER_PORT}`);
});