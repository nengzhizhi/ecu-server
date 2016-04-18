(function(){
  'use strict';
  angular
    .module('com.module.autohome')
    .service('AutohomeService', function ($state, AutohomeAccount, AutohomePassword, CoreService) {
      this.getAccounts = function (offset, limit) {
        return AutohomeAccount.find({
          filter: {
            offset: offset,
            limit: limit
          }
        }).$promise;
      }

      this.getAccount = function (id) {
        return AutohomeAccount.findOne({
          filter: {
            where: { id: id },
            include: 'passwords'
          }
        }).$promise;
      }

      this.upsertAccount = function (account, successCb, cancelCb) {
        return AutohomeAccount.upsert(account).$promise.then(function () {
          CoreService.alertSuccess('保存成功！', '', successCb);
        }, function (err) {
          CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
        })
      }

      this.addPassword = function (password, successCb, cancelCb) {
        AutohomePassword.upsert(password).$promise.then(function(){
          CoreService.alertSuccess('保存成功！', '', successCb);
        }, function (err) {
          CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
        })
      }

      this.removePassword = function (id, successCb, cancelCb) {
        AutohomePassword.deleteById(id).$promise.then(function(){
          CoreService.alertSuccess('保存成功！', '', successCb);
        }, function (err) {
          CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
        })
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
