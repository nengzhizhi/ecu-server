(function(){
  'use strict';
  angular
    .module('com.module.example')
    .service('ExampleService', function ($state) {
      this.getExample = function (id) {
        return Example.findById({id: id}).$promise;
      }

      this.getExamples = function () {
        return Example.find().$promise;
      }

      this.upsertExample = function (example, successCb, cancelCb) {
				return Example.upsert(example).$promise.then(function () {
					CoreService.alertSuccess('保存成功！', '', successCb);
				}, function (err) {
					CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
				})
			}

			this.deleteExample = function (id, successCb, cancelCb) {
				CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					Example.deleteById(id).$promise.then(function () {
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
    			}, {
            key: 'date',
            type: 'datePicker',
            templateOptions: {
              label: '时间',
              required: true,
              type: 'input'
            }
          }

    		]
    		return form;
    	}
    })
})();
