(function(){
	'use strict';
	angular
		.module('com.module.cases')
		.config(function ($stateProvider) {
			$stateProvider
				.state('app.cases', {
					abstract: true,
					url: '/cases',
					templateUrl: 'modules/cases/views/main.html'
				})
				.state('app.cases.list', {
					url: '/list',
					templateUrl: 'modules/cases/views/list.html',
					controllerAs: 'ctrl',
					controller: function ($state, cases, CaseService) {
						console.dir(cases)
						this.cases = cases;
						this.deleteCase = function(id){
							CaseService.deleteCase(id, function(){
								$state.go($state.current, {}, {reload: true});
							})
						}
					},
					resolve: {
						cases: function (CaseService) {
							return CaseService.getCases();
						}
					}
				})
				.state('app.cases.add', {
					url: '/add',
					templateUrl: 'modules/cases/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, CaseService, item) {
						this.item = item;
						this.formFields = CaseService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							CaseService.upsertCase(this.item).then(function (item) {
								$state.go('app.cases.edit');
							})
						}
					},
					resolve: {
						item: function () {
						}
					}
				})
				.state('app.cases.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/cases/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, item, CaseService) {
						this.item = item;
						this.formFields = CaseService.getFormFields();
						this.formOptions = {};
						this.submit = function () {
							CaseService.upsertCase(this.item).then(function () {
								$state.go($state.current, {}, { reload: true });
							})
						}
					},
					resolve: {
						item: function ($stateParams, CaseService) {
							return CaseService.getCase($stateParams.id);
						}
					}
				})
		})
})();
