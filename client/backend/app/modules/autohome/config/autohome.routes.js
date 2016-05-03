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
					url: '/accounts/:province',
					templateUrl: 'modules/autohome/views/accounts.html',
					controllerAs: 'ctrl',
					controller: function (AutohomeService, paginator) {
						this.paginator = paginator;

						this.updateAccount = function(account, status){
							account.status = status;

							AutohomeService.upsertAccount(account).then(function () {
								$state.go($state.current, {}, { reload: true });
							})
						}

					},
					resolve: {
						paginator: function (AutohomeService, Pagination, $stateParams) {
							var fetchFunction = function(offset, pageSize, callback){
								AutohomeService.getAccounts(offset, pageSize, $stateParams.province)
									.then(function (items) {
										callback(items);
									});								
							}

							var countFunction = function(callback){
								return AutohomeService.countAccounts($stateParams.province).then(function (count) {
									callback(count.count);
								});
							}

							return Pagination(fetchFunction, countFunction, 50);
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

						var self = this;
						this.updateStatus = function(status){
							self.account.status = status;

							AutohomeService.upsertAccount(self.account).then(function () {
								$state.go($state.current, {}, { reload: true });
							})
						}

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
								password: $scope.password,
								status: '已获得密码'
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
