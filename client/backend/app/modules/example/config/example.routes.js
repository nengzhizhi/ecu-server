(function(){
	'use strict';
	angular
		.module('com.module.example')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.example', {
					abstract: true,
					url: '/example',
					templateUrl: 'modules/example/views/main.html'
				})
				.state('app.example.list', {
					url: '/list',
					templateUrl: 'modules/example/views/list.html',
					controllerAs: 'ctrl',
					controller: function ($state, examples, ExampleService) {
						this.examples = examples;
						this.deleteExample = function(id){
							ExampleService.deleteExample(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						examples: function (ExampleService) {
							return ExampleService.getExamples();
						}
					}
				})
				.state('app.example.add', {
					url: '/add',
					templateUrl: 'modules/example/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, ExampleService, example) {
						this.example = example;
						this.formFields = ExampleService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							ExampleService.updateExample(this.example).then(function (example) {
								$state.go('app.example.edit');
							})
						}
					},
					resolve: {
						example: function () {
						}
					}
				})
				.state('app.examples.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/examples/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, example, ExampleService) {
						this.example = example;
						this.formFields = ExampleService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							ExampleService.updateExample(this.example).then(function () {
								$state.go($state.current, {}, { reload: true });
							})
						}
					},
					resolve: {
						example: function ($stateParams, ExampleService) {
							return ExampleService.getExample($stateParams.id);
						}
					}
				})
		})
})();
