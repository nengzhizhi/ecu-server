(function(){
	'use strict';
	angular
		.module('com.module.car')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.car', {
					abstract: true,
					url: '/car',
					templateUrl: 'modules/car/views/main.html'
				})
				.state('app.car.list_model', {
					url: '/list_model',
					templateUrl: 'modules/car/views/list_model.html',
					controllerAs: 'ctrl',
					controller: function ($state, carModels, CarService) {
						this.carModels = carModels;
						console.log(carModels);
						this.deleteCarModel = function(id){
							CarService.deleteCarModel(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						carModels: function (CarService) {
							return CarService.getCarModels();
						}
					}
				})
				.state('app.car.add_model', {
					url: '/add_model',
					templateUrl: 'modules/car/views/model_form.html',
					controllerAs: 'ctrl',
					controller: function ($state, CarService, carModel) {
						this.carModel = carModel;
						this.formFields = CarService.getCarModelFormFields();
						this.formOptions = {};

						this.submit = function () {
							CarService.upsertCarModel(this.carModel).then(function (carModel) {
								$state.go('app.car.edit_model');
							})
						}
					},
					resolve: {
						carModel: function () {
						}
					}
				})
				.state('app.car.edit_model', {
					url: '/edit_model/:id',
					templateUrl: 'modules/car/views/model_form.html',
					controllerAs: 'ctrl',
					controller: function ($state, CarService, carModel) {
						this.carModel = carModel;
						this.formFields = CarService.getCarModelFormFields();
						this.formOptions = {};

						this.submit = function () {
							CarService.upsertCarModel(this.carModel).then(function (carModel) {
								$state.go('app.car.edit_model');
							})
						}
					},
					resolve: {
						carModel: function ($stateParams, CarService) {
							return CarService.getCarModel($stateParams.id);
						}
					}
				})
				.state('app.car.list_brand', {
					url: '/list_brand',
					templateUrl: 'modules/car/views/list_brand.html',
					controllerAs: 'ctrl',
					controller: function ($state, carBrands, CarService) {
						this.carBrands = carBrands;
						this.deleteCarBrand = function(id){
							CarService.deleteCarBrand(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						carBrands: function (CarService) {
							return CarService.getCarBrands();
						}
					}
				})			
				.state('app.car.add_brand', {
					url: '/add_brand',
					templateUrl: 'modules/car/views/brand_form.html',
					controllerAs: 'ctrl',
					controller: function ($state, CarService, carBrand) {
						this.carBrand = carBrand;
						this.formFields = CarService.getCarBrandFormFields();
						this.formOptions = {};

						this.submit = function () {
							CarService.upsertCarBrand(this.carBrand).then(function (carBrand) {
								$state.go('app.car.edit_brand');
							})
						}
					},
					resolve: {
						carBrand: function () {
						}
					}
				})
				.state('app.car.edit_brand', {
					url: '/edit_brand/:id',
					templateUrl: 'modules/car/views/brand_form.html',
					controllerAs: 'ctrl',
					controller: function ($state, CarService, carBrand) {
						this.carBrand = carBrand;
						this.formFields = CarService.getCarBrandFormFields();
						this.formOptions = {};

						this.submit = function () {
							CarService.upsertCarBrand(this.carBrand).then(function (carBrand) {
								$state.go($state.current, {}, { reload: true });
							})
						}
					},
					resolve: {
						carBrand: function ($stateParams, CarService) {
							return CarService.getCarBrand($stateParams.id);
						}
					}
				})
		})
})();
