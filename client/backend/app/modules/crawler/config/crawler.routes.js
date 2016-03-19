(function(){
	'use strict';
	angular
		.module('com.module.crawler')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.crawler', {
					abstract: true,
					url: '/crawler',
					templateUrl: 'modules/crawler/views/main.html'
				})
				.state('app.crawler.account', {
					url: '/account',
					templateUrl: 'modules/crawler/views/account_list.html',
					controllerAs: 'ctrl',
					controller: function ($state, CrawlerService) {

					},
					resolve: {
						client: function ($stateParams, CrawlerService) {
							return [];
						}
					}
				})
				.state('app.crawler.build', {
					url: '/build',
					templateUrl: 'modules/crawler/views/build_crawler.html',
					controllerAs: 'ctrl',
					controller: function ($state, CrawlerService) {

					},
					resolve: {
						
					}
				})
		})
})();
