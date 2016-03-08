(function(){
  'use strict';
  angular
    .module('com.module.order')
    .service('OrderService', function ($state, Order) {
      this.getOrder = function (id) {
        return Order.findById({id: id}).$promise;
      }

      this.getOrders = function () {
        return Order.find().$promise;
      }

      this.upsertOrder = function (order, successCb, cancelCb) {
				return Order.upsert(order).$promise.then(function () {
					CoreService.alertSuccess('保存成功！', '', successCb);
				}, function (err) {
					CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
				})
			}

			this.deleteorder = function (id, successCb, cancelCb) {
				CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					Order.deleteById(id).$promise.then(function () {
						CoreService.alertSuccess('删除成功！', '', successCb);
					}, function (err) {
						CoreService.alertError('删除失败！', err, cancelCb);
					});
				})
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
