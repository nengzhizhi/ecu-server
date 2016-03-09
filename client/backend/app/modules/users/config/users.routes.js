(function(){
	'use strict';
	angular
		.module('com.module.users')
		.config(function ($stateProvider) {
			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: 'modules/users/views/login.html',
					controller: 'LoginCtrl',
					controllerAs: 'ctrl'
				})
				.state('logout', {
					url: '/logout',
					controllerAs: 'ctrl',
					controller: function (User, LoopBackAuth, $state) {
						User.logout({ "access_token": LoopBackAuth.accessTokenId }, function () {
							$state.go('login');
						})
					}
				})
				.state('app.users', {
					abstract: true,
					url: '/users',
					templateUrl: 'modules/users/views/main.html'
				})				
				.state('app.users.engineers', {
					url: '/engineers',
					controllerAs: 'ctrl',
					templateUrl: 'modules/users/views/engineers.html',
					controller: function (engineers) {
						this.engineers = engineers;
					},
					resolve: {
						engineers: function(){
							return [];
						}
					}
				})
				.state('app.users.salesmen', {
					url: '/salesmen',
					controllerAs: 'ctrl',
					templateUrl: 'modules/users/views/salesmen.html',
					controller: function (salesmen) {
						this.salesmen = salesmen;
					},
					resolve: {
						salesmen: function (UserService) {
							//return UserService.getSalesmen();
							return [];
						}
					}
				})
		})
})();