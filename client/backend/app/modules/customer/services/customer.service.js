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
  					type: 'input',
  					templateOptions: {
              label: '来源',
  						required: true
  					}
    			}, {
            key: 'car_model',
            type: 'select',
            templateOptions: {
              label: '汽车型号',
              required: true,
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
            type: 'input',
            templateOptions: {
              label: '当前状态'
            }
          }
    		]
    		return form;
    	}
    })
})();
