function injectHandlerDependencies(
  userCreateHandler, handlerToServiceMap, ValidationError, ...remainingArguments
) {
  const service = handlerToServiceMap.get(userCreateHandler);
  return (req, res) => { userCreateHandler(req, res, service, ValidationError, ...remainingArguments); };
}

export default injectHandlerDependencies;