/**
 * Created by zhoumaoqiao on 15/12/9.
 */
var express = require('express');
var router = express.Router();

var fs = require('fs');
var csv = require('csv');

/* GET load data page. */
router.get('/', function (req, res, next) {


    //res.send('upload data resource with csv file');
    //res.render('datas', {title: 'datas'});

    var filePath = __dirname + '/../public/bsp.csv';


    var output = [];
    var uid = [];
    var email =[];
    var generate = csv.generate;
    var parse = csv.parse;
    var transform = csv.transform;
    var stringify = csv.stringify();


    var rs = fs.createReadStream(filePath);
    var ws = fs.createWriteStream(filePath);

    var validatedEmailAddress;
    var UID;

    var parser = parse({
        delimiter: ',',
        //rowDelimiter: "\n",
        //quote: '"',
        //escape: '"',
        //auto_parse: true,
        columns: true
        //skip_empty_lines: true,
        //trim: true
    }, function (err, data) {
        //console.log(data);

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                UID = data[key]['UID'];
                if (data[key]['first_name'] && data[key]['last_name'] && data[key]['domain']) {
                    validatedEmailAddress = data[key]['first_name'].toLowerCase() + '.' + data[key]['last_name'].toLowerCase() + '@' + data[key]['domain'].toLowerCase();
                    console.log('Validated Email Address[' + UID + "] -> " + validatedEmailAddress);
                    uid.push(UID);
                    email.push(validatedEmailAddress);
                } else {
                    console.log(UID + " -> " + " This person has empty fields, so it could NOT get the validate email address!");
                }
            }
        }
        output.unshift(uid,email);
        res.json(output);
    });
    /**
     var transformer = transform(function (record, callback) {
        setTimeout(function () {
            //callback(null, record.join(' ')+'\n');
            //record.push(record);
            callback(null, record + '\n');
        }, 500);
    }, {parallel: 10});
     **/
        //input.pipe(parser).pipe(transformer).pipe(process.stdout);

    var transformer =transform(output,function(record){
        //record.email = output[0].split(':')[1];

        console.log("Progress");
        console.log(record);
        //return record;
    }, function (err, mes) {
        console.log('Done!');
        console.log(mes);
    });
    //var stringifier =stringify();
    rs.pipe(parser).pipe(transformer).pipe(process.stdout);


});





module.exports = router;