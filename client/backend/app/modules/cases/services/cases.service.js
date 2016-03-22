(function(){
  'use strict';
  angular
    .module('com.module.cases')
    .service('CaseService', function (CoreService, $state, Case) {
      this.getCase = function (id) {
        return Case.findById({id: id}).$promise;
      }

      this.getCases = function () {
        return Case.find().$promise;
      }

      this.upsertCase = function (item, successCb, cancelCb) {
				return Case.upsert(item).$promise.then(function () {
					CoreService.alertSuccess('保存成功！', '', successCb);
				}, function (err) {
					CoreService.alertError('保存失败！', err && err.statusText, cancelCb);
				})
			}

			this.deleteCase = function (id, successCb, cancelCb) {
				CoreService.confirm('确定删除？', '删除后无法恢复', function () {
					Case.deleteById(id).$promise.then(function () {
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
            type: 'input',
            templateOptions: {
              label: '改装日期',
              type: 'input',
              required: true
            }
          }, {
            key: 'location',
            type: 'input',
            templateOptions: {
              label: '所在地',
              type: 'input',
              required: true
            }
          }, {
            key: 'car_type',
            type: 'input',
            templateOptions: {
              label: '车辆类型',
              type: 'input',
              required: true
            }
          }, {
            key: 'thumbnail_url',
            type: 'input',
            templateOptions: {
              label: '缩略图地址',
              type: 'input',
              required: true
            }
          }, {
            key: 'description',
            type: 'input',
            templateOptions: {
              label: '简介',
              type: 'input',
              required: true
            }
          }, {
            key: 'photo_url_1',
            type: 'input',
            templateOptions: {
              label: '图片地址一',
              type: 'input'
            }
          },{
            key: 'photo_url_2',
            type: 'input',
            templateOptions: {
              label: '图片地址二',
              type: 'input'
            }
          },{
            key: 'photo_url_3',
            type: 'input',
            templateOptions: {
              label: '图片地址三',
              type: 'input'
            }
          },{
            key: 'photo_url_4',
            type: 'input',
            templateOptions: {
              label: '图片地址四',
              type: 'input'
            }
          },{
            key: 'photo_url_5',
            type: 'input',
            templateOptions: {
              label: '图片地址五',
              type: 'input'
            }
          }
    		]
    		return form;
    	}
    })
})();
