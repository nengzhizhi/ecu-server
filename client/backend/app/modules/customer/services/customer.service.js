(function(){
  'use strict';
  angular
    .module('com.module.customer')
    .service('CustomerService', function ($state, Customer) {
      this.getCustomer = function (id) {
        return Customer.findById({id: id}).$promise;
      }

      this.getCustomers = function () {
        return Customer.find().$promise;
      }

      this.upsertCustomer = function (customer, successCb, cancelCb) {
				return Customer.upsert(customer).$promise.then(function () {
					CoreService.alertSuccess('保存成功！', '', successCb);
				}, function (err) {
					CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
				})
			}

			this.deleteCustomer = function (id, successCb, cancelCb) {
				CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					Customer.deleteById(id).$promise.then(function () {
						CoreService.alertSuccess('删除成功！', '', successCb);
					}, function (err) {
						CoreService.alertError('删除失败！', err, cancelCb);
					});
				})
			}

      this.getFormFields = function(){
    		var form = [
    			{
  					key: 'source',
  					type: 'select',
  					templateOptions: {
              label: '来源',
              options: [
                {name: '微信', value: '微信'},
                {name: '百度', value: '百度'},
                {name: '淘宝', value: '淘宝'},
                {name: '汽车之家', value: '汽车之家'},
                {name: '其他', value: '其他'}
              ]
  					}
    			}
    		]
    		return form;
    	}
    })
})();
