var async = require('async');
var AutohomeCrawler = require('./autohomeCrawler');

var forumUrl = 'http://club.autohome.com.cn/bbs/forum-c-3788-1.html';
var postUrl = 'http://club.autohome.com.cn/bbs/thread-a-100024-50637095-1.html';

async.series({
	// crawlForumUrl: function (next) {
	// 	AutohomeCrawler.crawlForumUrl(forumUrl, 1, 10, function (err, urls) {
	// 		console.log(err, urls);
	// 	});
	// },
	// crawlForumPage: function (next) {
	// 	AutohomeCrawler.crawlForumPage(forumUrl, function (err, postUrls) {
	// 		console.log(err, postUrls);
	// 	});	
	// },
	crawlPostPage: function (next) {
		AutohomeCrawler.crawlPostPage(postUrl, function (err, profiles) {
			console.log(err, profiles);
		})
	},
	// parseLastLogin: function (next) {
	// 	AutohomeCrawler.parseLastLogin('11632767', function (err, result) {
	// 		console.log(err, result);
	// 	})
	// }
}, function (err, result) {
	//console.log(err, result);
})
