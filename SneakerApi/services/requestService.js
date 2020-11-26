function _requestFailed(res) {
  const statusCode = res.statusCode;
  if (statusCode >= 200 && statusCode < 300) {
    return false;
  }

  return true;

}
function _createFailResponse(res,req,status,message) {
  res.status(status);
  req.errorDescription = message;
}
async function _runEachFunctionAsPipeline(req,res,functions) {

  for (let index = 0; index < functions.length; ++index) {
    const job = functions[index]
    await job(req,res)

    if (_requestFailed(res)) {
      return sendError(req, res);
    }
  }
  sendData(req, res);
}

function sendData(req, res) {
  const result = {};
  result.accessToken = req.accessToken ? req.accessToken : {};
  result.data = req.data ? req.data : {};
  res.json(result);
}

function sendError(req, res) {
  const result = {};
  result.errorDescription = req.errorDescription
      ? req.errorDescription
      : ressources.responseMsg.default;
  res.json(result);
}

module.exports = {runEachFunctionAsPipeline:_runEachFunctionAsPipeline,createFailResponse:_createFailResponse };
