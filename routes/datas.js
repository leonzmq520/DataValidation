/**
 * Created by zhoumaoqiao on 15/12/9.
 */

var fs = require('fs');
var csv = require('fast-csv');

/* GET load data page. */
exports.uploadFile = function (req, res) {
    res.render('datas', {title: 'datas'});
};

/* POST upload file data */
exports.upload = function (req, res) {
    console.log('uploads file path:::::', req.files.uploadsCSVFile.path);
    var orignalFileName = req.files.uploadsCSVFile.originalFilename;
    var uploadsFilePath = req.files.uploadsCSVFile.path;

    if (orignalFileName) {
        var filePathOfReadFile = uploadsFilePath;
        var filePathOfWriteFile = __dirname + '/../public/uploads/' + orignalFileName;
        var rs = fs.createReadStream(filePathOfReadFile);
        var ws = fs.createWriteStream(filePathOfWriteFile, {encoding: "utf8"});

        csv
            .fromStream(rs, {headers: true})
            .transform(function (obj) {
                var validatedEmailAddress;
                if (obj.first_name && obj.last_name && obj.domain) {
                    validatedEmailAddress = obj.first_name.toLowerCase() + '.' + obj.last_name.toLowerCase() + '@' + obj.domain.toLowerCase();
                    console.log('Validated Email Address[' + obj.UID + "] -> " + validatedEmailAddress);
                } else {
                    console.log(obj.UID + " -> " + " This person has empty fields, so it could NOT get the validate email address!");
                }
                return {
                    "UID": obj.UID,
                    "first_name": obj.first_name,
                    "last_name": obj.last_name,
                    "domain": obj.domain,
                    "validatedEmailAddress": validatedEmailAddress
                };
            })
            .on("end", function () {
                console.log("Read file task done");
            })
            .pipe(csv.createWriteStream({headers: true}))
            .pipe(ws);
        ws.on("finish", function () {
            console.log("Write file task done");
            res.download(filePathOfWriteFile, "ValidatedEmail_" + orignalFileName);
        });
    }else{
        res.redirect("/upload");
    }

};


