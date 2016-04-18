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
				.state('app.autohome.account', {
					url: '/account/:id',
					templateUrl: 'modules/autohome/views/account_form.html',
					controllerAs: 'ctrl',
					controller: function ($scope, $stateParams, $state, AutohomeService, account) {
						this.account = account;
						$scope.password = null;

						this.possiblePassword = function(){
							AutohomeService.addPassword({
								accountId: $stateParams.id,
								value: $scope.password
							}, function() {
								$state.go($state.current, {}, {reload: true});
							});
						}

						this.removePassword = function(id){
							AutohomeService.removePassword({
								id: id
							}, function() {
								$state.go($state.current, {}, {reload: true});
							});							
						}

						this.correctPassword = function(password){
							AutohomeService.upsertAccount({
								id: $stateParams.id,
								password: password
							}, function() {
								$state.go($state.current, {}, {reload: true});
							});								
						}
					},
					resolve: {
						account: function ($stateParams, AutohomeService) {
							return AutohomeService.getAccount($stateParams.id);
						}
					}
				})
		})
})();
