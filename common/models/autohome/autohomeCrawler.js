var async = require('async');
var cheerio = require('cheerio');
var Iconv = require('iconv-lite');
var request = require('request');

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
	async.forEachOfSeries(forumUrls, function (forumUrl, idle, done) {
		self.crawlForumPage(forumUrl, function (err, urls) {
			postUrls = postUrls.concat(urls);
			done(err);
		});
	}, function (err) {
		return callback(err, postUrls);
	})
}

//爬取论坛页面，获取帖子列表
AutohomeCrawler.crawlForumPage = function (forumUrl, callback) {
	var self = this;

	if (!forumUrl.match(self.forumUrlReg))
		return callback(new Error('错误的地址！'));

	var postUrls = [];
	request({
		encoding: null,
		url: forumUrl,
		gzip:true
	}, function (err, response, body) {
		var buffer = new Buffer(body);
		if (!!err || response.statusCode != 200)
			return callback(err);

		var $ = cheerio.load(Iconv.decode(body, 'gb2312').toString());

		$('.list_dl').each(function (index, item) {
			var postUrl = $(item).find('dt').children('a').attr('href') 
			if (!!postUrl)
				postUrls.push(self.domain + postUrl);
		})
		callback(null, postUrls);		
	})
}

//根据帖子数量，分析帖子页面地址列表（URL）
AutohomeCrawler.parsePostUrl = function (postUrl, callback) {
	var self = this;

	if (!postUrl.match(self.postUrlReg))
		return callback(new Error('错误的PostUrl地址！'));

	request({
		encoding: null,
		url: postUrl,
		gzip:true
	}, function (err, response, body) {
		if (!!err || response.statusCode != 200)
			return callback(err);

		var $ = cheerio.load(Iconv.decode(body, 'gb2312').toString());
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


//爬取详情页面
AutohomeCrawler.crawlPostPage = function (url, callback) {
	var self = this;

	request({
		encoding: null,
		url: url,
		gzip:true
	}, function (err, response, body) {
		console.log("开始爬取页面：", url);

		if (!!err || response.statusCode != 200)
			return callback(err);

		var $ = cheerio.load(Iconv.decode(body, 'gb2312').toString());

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

				if (leftlists && leftlists.eq(7)) {
					profile.carType = leftlists.eq(7).children().eq(-1).text();
				} else if (leftlists && leftlists.eq(6)) {
					profile.carType = leftlists.eq(6).children().eq(-1).text();
				}

				users.push(profile);
			}
		})

		async.forEachOfSeries(users, function (user, idle, done) {
			self.parseLastLogin(user.uid, function (err, lastLogin) {
				user.lastLogin = lastLogin;
				done();
			})
		}, function (err) {
			console.log("爬取页面结束：", url);
			console.log("获取用户数量：", users.length);
			return callback(null, users);
		})
	})
}


//爬取用户个人资料页面，获取最后登录时间
AutohomeCrawler.parseLastLogin = function (uid, callback) {
	var detailUrl = 'http://i.service.autohome.com.cn/clubapp/OtherReply-' + uid + '-1.html';

	request({
		encoding: null,
		url: detailUrl,
		gzip:true
	}, function (err, response, body) {
		if (!!err || response.statusCode != 200)
			return callback(err);

		var text = Iconv.decode(body, 'gb2312').toString();
		var $ = cheerio.load(text);

		var lastLogin = $('.item-w1').eq(1).next().children().eq(1).text();
		return callback(null, lastLogin);
	})
}