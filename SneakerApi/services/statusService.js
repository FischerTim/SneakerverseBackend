function _resquestFaild(res) {
  const statusCode = res.statusCode;
  if (statusCode >= 200 && statusCode < 300) {
    return false;
  } else {
    return true;
  }
}
function _createFailResponse(res,req,status,message) {
  res.status(status);
  req.errorDescription = message;
}
module.exports = { resquestFaild: _resquestFaild,createFailResponse:_createFailResponse };
