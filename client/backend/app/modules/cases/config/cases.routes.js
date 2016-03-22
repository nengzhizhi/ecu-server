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
						this.cases = cases;
						this.deleteCase = function(id){
							CaseService.deleteClient(id, function(){
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
					controller: function ($state, CaseService, cases) {
						this.cases = cases;
						this.formFields = CaseService.getFormFields();
						this.formOptions = {};

						this.submit = function () {
							CaseService.upsertClient(this.cases).then(function (cases) {
								$state.go('app.cases.edit');
							})
						}
					},
					resolve: {
						cases: function () {
						}
					}
				})
				.state('app.cases.edit', {
					url: '/edit/:id',
					templateUrl: 'modules/cases/views/form.html',
					controllerAs: 'ctrl',
					controller: function ($state, case, CaseService) {
						// this.case = case;
						// this.formFields = CaseService.getFormFields();
						// this.formOptions = {};
						// this.submit = function () {
						// 	console.log(this.cases);
						// 	// CaseService.upsertClient(this.client).then(function () {
						// 	// 	$state.go($state.current, {}, { reload: true });
						// 	// })
						}
					},
					resolve: {
						case: function ($stateParams, CaseService) {
							return CaseService.getClient($stateParams.id);
						}
					}
				})
		})
})();
