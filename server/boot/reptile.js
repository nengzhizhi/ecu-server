var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');

module.exports = function(app){
	var AccountModel = app.models.Account;

	var AutohomeTask =  function(cfg) {
		this.config = {};

		this.getSectionItems = function(sectionId, startPage, endPage){
			var mainUrlTemplate = "http://club.autohome.com.cn/bbs/forum-a-";
			var mainUrls = [];

			for (var i = startPage; i <= endPage; i++) {
				mainUrls.push(mainUrlTemplate + sectionId + '-' + i + '.html');
			}

			async.forEach(mainUrls, function (item, callback){
				superagent.get(item)
					.end(function (err, sres) {
						if (!!err)
							callback(err);

						var $ = cheerio.load(sres.text);

						$('.list_dl').each(function (index, item) {
							console.log($(item).find('dt').children('a').attr('href'));
						})
						callback();
					})
			}, function (err) {
				if (!!err) 
					console.log(err);
			})
		}

		this.crawlThread = function(url, callback){
			superagent.get(url)
				.end(function (err, sres) {
					if (!!err)
						callback(err);

					var $ = cheerio.load(sres.text);
					var usernameReg = /^[0-9a-zA-Z_]+$/

					async.forEach($('a[xname=uname]'), function (item, cb) {
						var username = $(item).text();

						if (username.match(usernameReg)) {
							AccountModel.findOrCreate({
								username: username,
								source: "autohome.com.cn"
							}, cb);
						}
					})
				})
		}
	}

	var task = new AutohomeTask();
	//task.getSectionItems('100024', 1, 1);
	task.crawlThread('http://club.autohome.com.cn/bbs/thread-a-100024-50569721-1.html');
}