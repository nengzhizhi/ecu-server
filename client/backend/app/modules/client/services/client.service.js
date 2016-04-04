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
            type: 'input',
            templateOptions: {
              label: '日期',
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
                {name: '宝马X1', value: '宝马X1', brand: '宝马'},
                {name: '宝马3系', value: '宝马3系', brand: '宝马'},
                {name: '宝马5系', value: '宝马5系', brand: '宝马'},
                {name: '高尔夫', value: '高尔夫', brand: '大众'},
                {name: '朗动', value: '朗动', brand: '现代'},
                {name: '科鲁兹', value: '科鲁兹', brand: '雪佛兰'},
                {name: '英朗', value: '英朗', brand: '别克'},
                {name: '霸道', value: '霸道', brand: '丰田'},
                {name: 'A6', value: 'A6', brand: '奥迪'},
                {name: 'GLA', value: 'GLA', brand: '奔驰'},
                {name: '奥德赛', value: '奥德赛', brand: '本田'}
              ],
              required: true,
              groupProp: 'brand'
            }
          }, {
            key: 'status',
            type: 'select',
            templateOptions: {
              label: '当前状态',
              options: [
                {name: '请求联系', value: '请求联系'},
                {name: '询价', value: '询价'},
                {name: '预约上门', value: '预约上门'},
                {name: '预约到店', value: '预约到店'},
                {name: '完成服务', value: '完成服务'},
                {name: '其他', value: '其他'}
              ],
              required: true
            }
          }, {
            key: 'source',
            type: 'select',
            templateOptions: {
              label: '来源',
              options: [
                {name: '百度搜索', value: '百度搜索'},
                {name: '微信朋友圈', value: '微信朋友圈'},
                {name: 'QQ群', value: 'QQ群'},
                {name: '朋友介绍', value: '朋友介绍'},
                {name: '淘宝二手', value: '淘宝二手'},
                {name: '其他', value: '其他'}
              ],
              required: true
            }
          }, {
            key: 'price',
            type: 'input',
            templateOptions: {
              label: '价格',
              type: 'input'
            }
          }, {
            key: 'mobile',
            type: 'input',
            templateOptions: {
              label: '电话号码',
              type: 'input'
            }
          },{
            key: 'weixin',
            type: 'input',
            templateOptions: {
              label: '微信号',
              type: 'input'
            }
          },{
            key: 'qq',
            type: 'input',
            templateOptions: {
              label: 'QQ号码',
              type: 'input'
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
