(function(){
	'use strict';
	angular
		.module('com.module.autohome')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.autohome', {
					abstract: true,
					url: '/autohome',
					templateUrl: 'modules/autohome/views/main.html'
				})
				.state('app.autohome.accounts', {
					url: '/accounts',
					templateUrl: 'modules/autohome/views/accounts.html',
					controllerAs: 'ctrl',
					controller: function (AutohomeService, paginator) {
						this.paginator = paginator;
					},
					resolve: {
						paginator: function (AutohomeService, Pagination) {
							var fetchFunction = function(offset, pageSize, callback){
								AutohomeService.getAccounts(offset, pageSize)
									.then(function (items) {
										callback(items);
									});								
							}

							var countFunction = function(callback){
								return AutohomeService.countAccounts().then(function (count) {
									callback(count.count);
								});
							}

							return Pagination(fetchFunction, countFunction, 20);
						}
					}
				})
		})
})();
