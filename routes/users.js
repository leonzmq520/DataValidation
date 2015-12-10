var express = require('express');
var router = express.Router();


var fs = require('fs');
var csv = require('csv');

/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.send('respond with a resource');
    var filePath = __dirname + '/../public/bsp.csv';

    csv().from(filePath).on('data', console.log);
});


module.exports = router;
