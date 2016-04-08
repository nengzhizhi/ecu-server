(function(){
  'use strict';
  angular
    .module('com.module.car')
    .service('CarService', function ($state, CoreService, CarBrand, CarModel) {
      this.getCarModel = function (id) {
        return CarModel.findById({id: id}).$promise;
      }

      this.getCarModels = function () {
        return CarModel.find({
          filter: { include: 'brand' }
        }).$promise;
      }

      this.upsertCarModel = function (carModel, successCb, cancelCb) {
				return CarModel.upsert(carModel).$promise.then(function () {
					CoreService.alertSuccess('保存成功！', '', successCb);
				}, function (err) {
					CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
				})
			}

			this.deleteCarModel = function (id, successCb, cancelCb) {
				CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					CarModel.deleteById(id).$promise.then(function () {
						CoreService.alertSuccess('删除成功！', '', successCb);
					}, function (err) {
						CoreService.alertError('删除失败！', err, cancelCb);
					});
				})
			}



      this.getCarBrand = function (id) {
        return CarBrand.findById({id: id}).$promise;
      }

      this.getCarBrands = function () {
        return CarBrand.find().$promise;
      }

      this.upsertCarBrand = function (carBrand, successCb, cancelCb) {
        return CarBrand.upsert(carBrand).$promise.then(function () {
          CoreService.alertSuccess('保存成功！', '', successCb);
        }, function (err) {
          CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
        })
      }

      this.deleteCarBrand = function (id, successCb, cancelCb) {
        CoreService.confirm('确定删除？', '删除后无法恢复', function () {
          CarBrand.deleteById(id).$promise.then(function () {
            CoreService.alertSuccess('删除成功！', '', successCb);
          }, function (err) {
            CoreService.alertError('删除失败！', err, cancelCb);
          });
        })
      }

      this.getCarBrandFormFields = function(){
        var form = [
          {
            key: 'name',
            type: 'input',
            templateOptions: {
              label: '品牌',
              required: true
            }            
          }
        ]
        return form;        
      }

      this.getCarModelFormFields = function(){
    		var form = [
    			{
  					key: 'brandId',
  					type: 'select',
  					templateOptions: {
              label: '品牌',
  						required: true
  					},
            controller: function($scope, CarBrand){
              CarBrand.find().$promise.then(function (brands) {
                var options = [];

                brands.forEach(function (brand){
                  options.push({
                    name: brand.name,
                    value: brand.id
                  })
                })
                $scope.options.templateOptions.options = options;
              })
            }
    			}, {
            key: 'name',
            type: 'input',
            templateOptions: {
              label: '型号',
              required: true
            }            
          }
    		]
    		return form;
    	}
    })
})();
