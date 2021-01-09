const mongoose = require("mongoose");

function formatDate(){
    const date =new Date(Date.now())
    console.log(date)
    let d = date.getDay()
    let m = date.getMonth()+1
    let y = date.getFullYear()

    let lh = date.getHours()
    let tm = date.getMinutes()
    const iwas=[d,m,y].join(".")+" "+[lh,tm].join(":")
    console.log(iwas)
    return
}

module.exports = new mongoose.Schema({
    _senderName: {type: String, required: true},
    _message: {type: String, required: true},
    _chatId: {type: String, required: true},
    _created: {type: String, default: formatDate(Date.now), required: true},
});
