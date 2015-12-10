//var express = require('express');
//var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Upload' });
//});

//module.exports = router;
exports.index = function (req, res) {
    res.render('index', {title: 'data'});
};