(function(){
	'use strict';
	angular
		.module('com.module.core')
		.factory('Pagination', function (){
			return function (fetchFunction, countFunction, pageSize) {
				var pagination = {
					next: function () {
						if (this.hasNextPage) {
							this.offset += pageSize;
							this.currentPageNumber ++;
							this._load();
						}
					},
					prev: function () {
						if (this.hasPrev()) {
							this.offset -= pageSize;
							this.currentPageNumber --;
							this._load();
						}
					},
					_load: function () {
						var self = this;
						fetchFunction(self.offset, pageSize, function (items) {
							self.currentPageItems = items;
							self.hasNextPage = items.length === pageSize;
						})

						countFunction(function (count) {
							self.totalPageCount = Math.ceil(count/pageSize);
						})
					},
					hasNext: function () {
						return this.hasNextPage;
					},
					hasPrev: function () {
						return this.offset !== 0;
					},
					jump: function(page) {
						this.currentPageNumber = page;
						this.offset = (page - 1) * pageSize;
						this._load();
					},
					currentPageItems: [],
					totalPageCount: 1,
					currentPageNumber: 1,
					offset: 0
				}
				pagination._load();
				return pagination;
			}
		})
})();