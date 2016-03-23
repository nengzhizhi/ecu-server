var request = require('request');
var Iconv = require('iconv-lite');

request({
    encoding: null,
    url: 'http://club.autohome.com.cn/bbs/forum-a-100024-1.html'
}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
    	//console.log(body);
      console.log(Iconv.decode(body, 'gb2312').toString());
    }
});