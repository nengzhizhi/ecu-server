(function(){
	'use strict';
	angular
		.module('com.module.core')
		.run(function (formlyConfig, $rootScope) {
    	formlyConfig.setWrapper([
				{
					name: 'label',
					templateUrl: 'modules/core/views/formly/label.html'
				}
    	])

    	formlyConfig.setType({
				name: 'input',
				template: '<input type="text" class="frm_input frm_msg_content" ng-model="model[options.key]">',
				wrapper: ['label']
			})

			formlyConfig.setType({
				name: 'select',
				template: '<select class="frm_input frm_msg_content" ng-model="model[options.key]"></select>',
				wrapper: ['label'],
				defaultOptions(options) {
					var ngOptions = options.templateOptions.ngOptions || `option[to.valueProp || 'value'] as option[to.labelProp || 'name'] group by option[to.groupProp || 'group'] for option in to.options`;					
					return {
					  ngModelAttrs: {
					    [ngOptions]: {
					      value: options.templateOptions.optionsAttr || 'ng-options'
					    }
					  }
					};
				}
			})

			formlyConfig.setType({
				name: 'datePicker',
				templateUrl: 'elements/datePicker.html',
				wrapper: ['label'],
				defaultOptions: {
templateOptions: {
						datepickerOptions: {
							format: 'yyyy-MM-dd',
							initDate: new Date()
						}
					}
				}
			})

			// formlyConfig.setType({
			// 	name: 'datePicker',
			// 	template: '',
			// 	defaultOptions(options){
					
			// 	}
			// })

			$rootScope.domainUrl = "http://b.meepo.cn";
		})
})();
