(function(){
	'use strict';
	angular
	.module('com.module.users')
	.service('UserService', function ($state, User, Engineer, Salesman) {
		this.currentUser = function (successCb, errorCb) {
			return User.getCurrent(successCb, errorCb);
		}

		this.getEngineers = function () {
			return Engineer.find().$promise;
		}

		this.getSalesmen = function () {
			return Salesman.find().$promise;
		}
	})
})();