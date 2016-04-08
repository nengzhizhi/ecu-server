(function(){
	'use strict';
	angular
		.module('com.module.customer')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.customer', {
					abstract: true,
					url: '/customer',
					templateUrl: 'modules/customer/views/main.html'
				})
				.state('app.customer.list', {
					url: '/list',
					templateUrl: 'modules/customer/views/list.html',
					controllerAs: 'ctrl',
					controller: function ($state, customers, CustomerService) {
						this.customers = customers;
						this.deleteCustomer = function(id){
							CustomerService.deleteCustomer(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						customers: function (CustomerService) {
							return CustomerService.getCustomers();
						}
					}
				})
				.state('app.customer.add', {
					url: '/add',
					templateUrl: 'modules/customer/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, CustomerService, customer) {
						this.customer = customer;
						this.formFields = CustomerService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							CustomerService.updateCustomer(this.customer).then(function (customer) {
								$state.go('app.customer.edit');
							})
						}
					},
					resolve: {
						customer: function () {
						}
					}
				})
				.state('app.customer.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/customers/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, customer, CustomerService) {
						this.customer = customer;
						this.formFields = CustomerService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							CustomerService.updateCustomer(this.customer).then(function () {
								$state.go($state.current, {}, { reload: true });
							})
						}
					},
					resolve: {
						customer: function ($stateParams, CustomerService) {
							return CustomerService.getCustomer($stateParams.id);
						}
					}
				})
		})
})();
