(function(){
	'use strict';
	angular
		.module('com.module.order')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.order', {
					abstract: true,
					url: '/order',
					templateUrl: 'modules/order/views/main.html'
				})
				.state('app.order.list', {
					url: '/list',
					templateUrl: 'modules/order/views/list.html',
					controllerAs: 'ctrl',
					controller: function ($state, orders, OrderService) {
						this.orders = orders;
						this.deleteorder = function(id){
							OrderService.deleteShop(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						orders: function (OrderService) {
							return OrderService.getOrders();
						}
					}
				})
				.state('app.order.add', {
					url: '/add',
					templateUrl: 'modules/order/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, OrderService, order) {
						this.order = order;
						this.formFields = OrderService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							OrderService.upsertOrder(this.order).then(function (order) {
								$state.go('app.order.edit');
							})
						}
					},
					resolve: {
						order: function () {
						}
					}
				})
				.state('app.orders.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/orders/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, order, OrderService) {
						this.order = order;
						this.formFields = ShopService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							OrderService.upsertOrder(this.order).then(function () {
								$state.go($state.current, {}, { reload: true });
							})
						}
					},
					resolve: {
						order: function ($stateParams, OrderService) {
							return OrderService.getShop($stateParams.id);
						}
					}
				})
		})
})();
