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
				template: '<span class="frm_input_box"><input type="text" class="frm_input frm_msg_content" ng-model="model[options.key]"></span>',
				wrapper: ['label']
			})

			formlyConfig.setType({
				name: 'select',
				template: '<span class="frm_input_box"><select class="frm_input frm_msg_content" ng-model="model[options.key]"></select></span>',
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
				name: 'textarea',
				template: '<span class="frm_textarea_box "><textarea class="frm_textarea" ng-model="model[options.key]"></textarea></span>',
				wrapper: ['label'],
				defaultOptions: {
				}
			})

			formlyConfig.setType({
				name: 'datepicker',
				template: '<span class="frm_input_box"><input pick-a-date="date" pick-a-date-options="{ format: \'yyyy/mm/dd\' }" type="text" class="frm_input frm_msg_content" ng-model="model[options.key]"></span>',
				wrapper: ['label'],
				defaultOptions: {
					ngModelAttrs: {
						'pick-a-date': {attribute: 'date'}
					}
				}				
			})

			formlyConfig.setType({
				name: 'timepicker',
				template: '<span class="frm_input_box"><input pick-a-time="time" pick-a-time-options="{format: \'HH:i\', interval: 60}" type="text" class="frm_input frm_msg_content" ng-model="model[options.key]"></span>',
				wrapper: ['label'],
				defaultOptions: {
					// ngModelAttrs: {
					// 	'pick-a-date': {attribute: 'date'}
					// }
				}				
			})

	})
})();
