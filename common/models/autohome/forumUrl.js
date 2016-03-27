var crawler = require('./autohomeCrawler.js');
var async = require('async');

module.exports = function (ForumUrl) {
	ForumUrl.crawl = function (forumUrl, start, number, cb) {
		var PostUrl = ForumUrl.app.models.PostUrl;
		var AccountModel = ForumUrl.app.models.AutohomeAccount;
		var crawledUserNumber = 0;
		var toCrawleUrlNumber = 0;
		var crawledUrlNumber = 0;

		async.waterfall([
			function crawlForum (next) {
				crawler.crawlForumUrl(forumUrl, start, number, next);
			}, 
			function filterUrl (urls, next) {
				var filterUrls = [];
				
				async.forEachOfSeries(urls, function (url, idle, done) {
					PostUrl.findOrCreate({ url: url }, function (err, instance) {
						if (!!err)
							return cb(err);

						toCrawleUrlNumber ++;

						if (!instance.crawl_time || Date.now() - instance.crawl_time > 1000 * 3600 ) {
							filterUrls.push(url);
						}

						if (!instance.crawl_time) {
							instance.crawl_time = new Date();
							instance.save();
						}

						done();
					})
				}, function (err) {
					next(err, filterUrls);
				})
			}, function parsePostUrls (filterUrls, next) {
				var urls = [];

				//filterUrls root thread_urls
				async.forEachOfSeries(filterUrls, function (postUrl, idle, done1) {
					crawler.parsePostUrl(postUrl, function (err, pageUrls) {
						urls = urls.concat(pageUrls);

						async.forEachOfSeries(pageUrls, function (pageurl, idle, done2) {
							PostUrl.findOrCreate({ url: pageurl }, function (err, instance) {
								if (!!err)
									return cb(err);

								toCrawleUrlNumber ++;

								instance.crawl_time = new Date();
								instance.save();
								done2();
							})
						})

						done1(err);
					})
				}, function (err) {
					next(err, urls);
				})
			}, function crawlPostPages (pageurls, next) {
				var users = [];

				//
				async.forEachOfSeries(pageurls, function (pageUrl, idle, done1) {
					crawler.crawlPostPage(pageUrl, function (err, profiles) {
						
						//统计完成百分比
						crawledUrlNumber ++;
						console.log('完成爬虫百分比：', crawledUrlNumber/toCrawleUrlNumber ,'%');
						
						users = users.concat(profiles);

						async.forEachOfSeries(profiles, function (profile, idle, done2) {
							AccountModel.findOrCreate({
								uname: profile.uname
							}, function (err, instance) {
								if (!instance.uid) {
									instance.uid = profile.uid;
									instance.post_number = profile.postNumber;
									instance.reply_number = profile.replyNumber;
									instance.register_time = profile.registerTime;
									instance.from = profile.from;
									instance.car_type = profile.carType;
									instance.last_login = profile.last_login;
									instance.status = 'crawled';
									instance.save();
									crawledUserNumber ++;
								}
								
								done2(err);
							})
						}, function (err) {
							done1(err);
						})
					})
				}, function (err) {
					next(err, users);
				})
			}
		], function (err, users) {
			console.log('crawled url number: ', crawledUrlNumber);
			console.log('crawled users number: ', crawledUserNumber);
			cb(err, users);
		})
	}

	ForumUrl.remoteMethod('crawl', {
		accepts: [
			{ arg: 'forumUrl', type: 'string' },
			{ arg: 'start', type: 'number' },
			{ arg: 'number', type: 'number' },
		],
		returns: { root: true },
		http: { path: '/crawl', verb: 'post' }
	})
}