(function(){
  'use strict';
  angular
    .module('com.module.client')
    .service('ClientService', function (CoreService, $state, Client) {
      this.getClient = function (id) {
        return Client.findById({id: id}).$promise;
      }

      this.getClients = function () {
        return Client.find().$promise;
      }

      this.upsertClient = function (client, successCb, cancelCb) {
				return Client.upsert(client).$promise.then(function () {
					CoreService.alertSuccess('保存成功！', '', successCb);
				}, function (err) {
					CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
				})
			}

			this.deleteClient = function (id, successCb, cancelCb) {
				CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					Client.deleteById(id).$promise.then(function () {
						CoreService.alertSuccess('删除成功！', '', successCb);
					}, function (err) {
						CoreService.alertError('删除失败！', err, cancelCb);
					});
				})
			}


      this.getFormFields = function(){
    		var form = [
          {
            key: 'date',
            type: 'datepicker',
            templateOptions: {
              label: '日期'
            }
          }, {
            key: 'time',
            type: 'timepicker',
            templateOptions: {
              label: '时间'
            }
          }

    		]
    		return form;
    	}
    })
})();
