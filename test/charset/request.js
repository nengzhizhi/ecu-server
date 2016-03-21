var request = require('request');
var Iconv = require('iconv-lite');

request({
    encoding: null,
    url: 'http://www.autohome.com.cn/'
}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(Iconv.decode(body, 'gb2312').toString());
    }
});