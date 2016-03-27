(function(){
  'use strict';
  angular
    .module('com.module.autohome')
    .service('AutohomeService', function ($state, AutohomeAccount) {
      this.getAccounts = function (offset, limit) {
        return AutohomeAccount.find({
          filter: {
            offset: offset,
            limit: limit
          }
        }).$promise;
      }

      this.countAccounts = function () {
        return AutohomeAccount.count().$promise;
      }

      this.getFormFields = function(){
    		var form = [
    			{
  					key: 'username',
  					type: 'input',
  					templateOptions: {
              label: '账号',
  						required: true,
  						type: 'input'
  					}
    			}
    		]
    		return form;
    	}
    })
})();
