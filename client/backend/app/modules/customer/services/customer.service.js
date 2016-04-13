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
            key: 'date',
            type: 'datepicker',
            templateOptions: {
              label: '日期'
            }
          }, {
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
    			}, {
             key: 'car_model',
             type: 'select',
             templateOptions: {
               label: '汽车型号',
               groupProp: 'brand'
             },
             controller: function ($scope, CarModel) {
               CarModel.find({
                 filter: { include: 'brand' }
               }).$promise.then(function (models) {
                 var options = [];
                 models.forEach(function (model) {
                   options.push({
                     name: model.name,
                     value: model.name,
                     brand: model.brand.name
                   })
                 })
                 $scope.options.templateOptions.options = options;
               })
             }            
           }, {
             key: 'mobile',
             type: 'input',
             templateOptions: {
               label: '电话'
             }
           }, {
             key: 'qq',
             type: 'input',
             templateOptions: {
               label: 'QQ'
             }
           }, {
             key: 'weixin',
             type: 'input',
             templateOptions: {
               label: '微信号'
             }
           }, {
             key: 'quote',
             type: 'input',
             templateOptions: {
               label: '报价'
             }
           }, {
            key: 'status',
            type: 'select',
            templateOptions: {
              label: '当前状态',
              options: [
                {name: '联系', value: '联系'},
                {name: '询价', value: '询价'},
                {name: '预约', value: '预约'},
                {name: '成交', value: '成交'},
                {name: '其他', value: '其他'}
              ]
            }
          }, 
    		]
    		return form;
    	}
    })
})();
