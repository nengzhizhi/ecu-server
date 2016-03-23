var crawler = require('./autohomeCrawler.js');
var async = require('async');

module.exports = function (ForumUrl) {
	ForumUrl.crawl = function (forumUrl, start, number, cb) {
		var PostUrl = ForumUrl.app.models.PostUrl;
		var AccountModel = ForumUrl.app.models.AutohomeAccount;

		async.waterfall([
			function crawlForum (next) {
				crawler.crawlForumUrl(forumUrl, start, number, next);
			}, 
			function filterUrl (urls, next) {
				var filterUrls = [];
				
				async.forEach(urls, function (url, done) {
					PostUrl.findOrCreate({ url: url }, function (err, instance) {
						if (!!err)
							return cb(err);

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
				console.log('filterUrls: ', filterUrls);
				var urls = [];

				async.forEach(filterUrls.slice(1, 10), function (postUrl, done) {
					crawler.parsePostUrl(postUrl, function (err, pageUrls) {
						urls = urls.concat(pageUrls);
						done(err);
					})
				}, function (err) {
					next(err, urls);
				})
			}, function crawlPostPages (pageurls, next) {
				var users = [];

				async.forEach(pageurls.slice(1, 10), function (pageUrl, done1) {
					crawler.crawlPostPage(pageUrl, function (err, profiles) {
						console.log('crawled ', profiles.length, ' users');
						users = users.concat(profiles);

						async.forEach(profiles, function (profile, done2) {
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
			console.log('crawled finished!');
			console.log('crawled users number: ', users.length);
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