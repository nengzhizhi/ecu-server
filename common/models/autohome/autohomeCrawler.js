var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var AutohomeCrawler = module.exports = function(){
}

AutohomeCrawler.unameReg = /^[0-9a-zA-Z_]+$/;
AutohomeCrawler.domain = 'http://club.autohome.com.cn';
AutohomeCrawler.forumUrlReg = /^http:\/\/club.autohome.com.cn\/bbs\/forum-([a-z])-([\d]+)-([\d]+).html$/;
AutohomeCrawler.postUrlReg = /^http:\/\/club.autohome.com.cn\/bbs\/thread-([a-z])-([\d]+)-([\d]+)-([\d]+).html$/;


AutohomeCrawler.crawlForumUrl = function (forumUrl, start, number, callback) {
	var self = this;

	if (!forumUrl.match(self.forumUrlReg))
		return callback(new Error('错误的地址！'));

	var forumUrls = [];

	for (var i = start; i <= number; i ++) {
		forumUrl.replace(self.forumUrlReg, function ($1, $2, $3) {
			forumUrls.push('http:\/\/club.autohome.com.cn\/bbs\/forum-' + $2 + '-' + $3 +'-' + i + '.html');
		});
	}

	var postUrls = [];
	async.forEach(forumUrls, function (forumUrl, done) {
		self.crawlForumPage(forumUrl, function (err, urls) {
			postUrls = postUrls.concat(urls);
			done(err);
		});
	}, function (err) {
		return callback(err, postUrls);
	})
}

AutohomeCrawler.crawlForumPage = function (forumUrl, callback) {
	var self = this;

	if (!forumUrl.match(self.forumUrlReg))
		return callback(new Error('错误的地址！'));

	var postUrls = [];
	superagent.get(forumUrl)
		.end(function (err, sres) {
			if (!!err)
				return callback(err);

			var text = iconv.decode(new Buffer(sres.text), 'GBK').toString();
			console.log(text);
			var $ = cheerio.load(text);

			$('.list_dl').each(function (index, item) {
				//console.log($(item).find('dt').children('a').text());
				var postUrl = $(item).find('dt').children('a').attr('href') 
				if (!!postUrl)
					postUrls.push(self.domain + postUrl);
			})
			callback(null, postUrls);
		})	
}


AutohomeCrawler.parsePostUrl = function (postUrl, callback) {
	var self = this;

	if (!postUrl.match(self.postUrlReg))
		return callback(new Error('错误的PostUrl地址！'));

	superagent.get(postUrl)
		.end(function (err, sres) {
			console.log(postUrl);

			if (!!err)
				return callback(new Error('获取PostUrl页面失败！'));

			var $ = cheerio.load(sres.text);
			var pageText = $('.gopage').children().eq(1).text();
			var pageNumber = pageText.replace(/[^0-9]/ig,"");
			var pageUrls = [];

			for (var i = 1; i <= pageNumber; i ++) {
				postUrl.replace(self.postUrlReg, function ($1, $2, $3, $4) {
					pageUrls.push('http://club.autohome.com.cn/bbs/thread-' + $2 + '-' + $3 + '-' + $4 + '-' + i + '.html');
				})
			}

			return callback(null, pageUrls);
		})
}

AutohomeCrawler.crawlPostPage = function (url, callback) {
	var self = this;

	superagent.get(url)
		.end(function (err, sres){
			if (!!err)
				return callback(err);

			var $ = cheerio.load(sres.text);
			var comments = $('.conleft');

			if (!comments)
				return callback(new Error('获取评论列表失败！'));

			var users = [];
			comments.each(function (index, comment) {
				var uelement = $(this).find('a[xname=uname]');

				var uname = uelement.text();
				var uid = uelement.attr('href').replace(/[^0-9]/ig,"");

				if (uname.match(self.unameReg)) {
					var profile = {};
					profile.uname = uname;
					profile.uid = uid;
					
					var leftlists = $(this).find('.leftlist').children();
					if (leftlists && leftlists.eq(3)) {
						profile.postNumber = leftlists.eq(3).children().eq(0).text();
						profile.postNumber = profile.postNumber.substr(0, profile.postNumber.length - 2);

						profile.replyNumber = leftlists.eq(3).children().eq(2).text();
						profile.replyNumber = profile.replyNumber.substr(0, profile.replyNumber.length - 2);
					}

					if (leftlists && leftlists.eq(4)) {
						profile.registerTime = leftlists.eq(4).text();
						profile.registerTime = profile.registerTime.substr(3);
					}

					if (leftlists && leftlists.eq(5)) {
						profile.from = leftlists.eq(5).children().eq(0).text();
					}

					if (leftlists && leftlists.eq(6)) {
						profile.carType = leftlists.eq(6).children().eq(-1).text();
					}

					users.push(profile);
				}
			})

			async.forEach(users, function (user, done) {
				self.parseLastLogin(user.uid, function (err, lastLogin) {
					user.lastLogin = lastLogin;
					done();
				})
			}, function (err) {
				return callback(null, users);
			})
		})
}

AutohomeCrawler.parseLastLogin = function (uid, callback) {
	var detailUrl = 'http://i.service.autohome.com.cn/clubapp/OtherReply-' + uid + '-1.html';

	superagent.get(detailUrl).end(function (err, sres) {
		if (!!err)
			return callback(err);

		var $ = cheerio.load(sres.text);
		var lastLogin = $('.item-w1').eq(1).next().children().eq(1).text();
		return callback(null, lastLogin);
	})
}