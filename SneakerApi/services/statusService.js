
function _breakRequest(res){
    const statusCode = res.statusCode
    if(statusCode >= 200 && statusCode < 300){
        return false
    }else{
        return true
    }
}
module.exports = {breakRequest:_breakRequest}