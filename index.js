'use strict';

var xray = require('x-ray');
var x = xray();
var cheerio = require('cheerio');

var mongojs = require('mongojs');
var db = mongojs('mongodb://zavatta:' + process.env.NODE_PASS + '@ds045948.mongolab.com:45948/captaintyper', ['text']);

function call () {

  x('http://en.wikipedia.org/wiki/Special:Random', '#mw-content-text@html')(function (err, content) {
    if (err) { return console.log('pute', err); }
    console.log('scrapping...');
    var $ = cheerio.load(content);

    var text = $('p:first-child').text();
    text = text.replace(new RegExp('\[[0-9]+\]', 'g'), '');
    if (text.length < 1000) {
      call();
    } else {
      db.text.insert({ value: text }, function (err) {
        if (err) { return console.log(err); }
        console.log(text.length);
      });
    }

  });

};

for (var i = 0; i < 1000; ++i) {
  call();
}
