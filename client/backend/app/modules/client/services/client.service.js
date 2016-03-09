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
  					key: 'name',
  					type: 'input',
  					templateOptions: {
              label: '姓名',
  						type: 'input'
  					}
    			}, {
            key: 'city',
            type: 'select',
            templateOptions: {
              label: '所在城市',
              options: [
                {name: '广州', value: '广州', province: '广东省'},
                {name: '深圳', value: '深圳', province: '广东省'},
                {name: '上海', value: '上海', province: '上海市'}
              ],
              required: true,
              groupProp: 'province'
            }
          }, {
            key: 'car_type',
            type: 'select',
            templateOptions: {
              label: '车辆型号',
              options: [
                {name: '宝马3系', value: '宝马3系', brand: '宝马'},
                {name: '宝马5系', value: '宝马5系', brand: '宝马'},
                {name: '高尔夫', value: '高尔夫', brand: '大众'}
              ],
              required: true,
              groupProp: 'brand'
            }
          }, {
            key: 'source',
            type: 'select',
            templateOptions: {
              label: '来源',
              options: [
                {name: '百度搜索', value: '百度搜索'},
                {name: '微信群', value: '微信群'},
                {name: 'QQ群', value: 'QQ群'},
                {name: '朋友介绍', value: '朋友介绍'},
                {name: '其他', value: '其他'}
              ],
              required: true
            }
          }, {
            key: 'contact_type',
            type: 'select',
            templateOptions: {
              label: '联系方式',
              options: [
                {name: '微信号', value: '微信号'},
                {name: 'QQ号', value: 'QQ号'},
                {name: '手机号', value: '手机号'}
              ],              
              required: true
            }
          }, {
            key: 'contact_number',
            type: 'input',
            templateOptions: {
              label: '联系号码',
              type: 'input',
              required: true
            }
          }, {
            key: 'remark',
            type: 'input',
            templateOptions: {
              label: '备注',
              type: 'input'
            }
          }

    		]
    		return form;
    	}
    })
})();
