const resources = require("../resource/constant");
let service = ""

let fs = require('fs');
let path = require('path');
let multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

let upload = multer({ storage: storage });
const get = ()=>{return upload}
module.exports = get
