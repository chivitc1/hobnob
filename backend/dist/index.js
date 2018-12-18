"use strict";

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _checkEmptyPayload = _interopRequireDefault(require("./middlewares/check-empty-payload"));

var _checkContentTypeIsSet = _interopRequireDefault(require("./middlewares/check-content-type-is-set"));

var _checkContentIsJson = _interopRequireDefault(require("./middlewares/check-content-is-json"));

var _errorHandle = _interopRequireDefault(require("./middlewares/error-handle"));

var _user = _interopRequireDefault(require("./validators/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
app.use(_checkEmptyPayload.default);
app.use(_checkContentTypeIsSet.default);
app.use(_checkContentIsJson.default);
app.use(_bodyParser.default.json({
  limit: 1e6
}));
app.use(_user.default);
app.post('/users', (req, res) => {
  console.log("handle post /users");
}); // Handling error

app.use(_errorHandle.default);
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at port ${process.env.SERVER_PORT}`);
});