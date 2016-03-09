module.exports = function (Order) {
  // Client.validatesInclusionOf('source', {in: [ 'weixin', 'baidu', 'other' ]});
  Order.afterCreate = function (next, instance) {
  	instance.created = new Date();
  	next();
  }
}