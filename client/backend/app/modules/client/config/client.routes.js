(function(){
	'use strict';
	angular
		.module('com.module.client')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.client', {
					abstract: true,
					url: '/client',
					templateUrl: 'modules/client/views/main.html'
				})
				.state('app.client.list', {
					url: '/list',
					templateUrl: 'modules/client/views/list.html',
					controllerAs: 'ctrl',
					controller: function ($state, clients, ClientService) {
						this.clients = clients;
						this.deleteClient = function(id){
							ClientService.deleteClient(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						clients: function (ClientService) {
							return ClientService.getClients();
						}
					}
				})
				.state('app.client.add', {
					url: '/add',
					templateUrl: 'modules/client/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, ClientService, client) {
						this.client = client;
						this.formFields = ClientService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							ClientService.upsertClient(this.client).then(function (client) {
								$state.go('app.client.edit');
							})
						}
					},
					resolve: {
						client: function () {
						}
					}
				})
				.state('app.client.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/client/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, client, ClientService) {
						this.client = client;
						this.formFields = ClientService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							ClientService.upsertClient(this.client).then(function () {
								$state.go($state.current, {}, { reload: true });
							})
						}
					},
					resolve: {
						client: function ($stateParams, ClientService) {
							return ClientService.getClient($stateParams.id);
						}
					}
				})
		})
})();
