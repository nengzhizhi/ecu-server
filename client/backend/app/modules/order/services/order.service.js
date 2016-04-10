(function(){
  'use strict';
  angular
    .module('com.module.order')
    .service('OrderService', function (CoreService, $state, Order) {
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
            key: 'clientId',
            type: 'input',
            templateOptions: {
              label: '车主编号',
              required: true,
              type: 'input'
            }
          }, {
  					key: 'price',
  					type: 'input',
  					templateOptions: {
              label: '价格',
  						required: true,
  						type: 'input'
  					}
    			}, {
            key: 'payment',
            type: 'select',
            templateOptions: {
              label: '支付方式',
              options: [
                {name: '微信', value: '微信', group: ''},
                {name: '支付宝', value: '支付宝'},
                {name: '现金', value: '现金'},
                {name: '其他', value: '其他'}
              ]
            }
          }, {
            key: 'status',
            type: 'select',
            templateOptions: {
              label: '订单状态',
              options: [
                {name: '预约中', value: '预约中'},
                {name: '刷写完成', value: '刷写完成'}
              ],
              required: true,
            }
          }, {
            key: 'remark',
            type: 'input',
            templateOptions: {
              label: '备注',
              type: 'input'
            }
          },
    		]
    		return form;
    	}
    })
})();
