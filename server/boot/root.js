module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  // router.get('/', server.loopback.status());

  router.get('/', function (req, res) {
    res.render('index.html');
  })

	router.get('/index', function (req, res) {
		res.render('index.html');
	})

	router.get('/about_us', function (req, res) {
		res.render('about_us.html');
	})

  router.get('/why_ecu', function (req, res) {
  	res.render('why_ecu.html');
  })

  router.get('/brand', function (req, res) {
    res.render('brand.html');
  })

  router.get('/map', function (req, res) {
    res.render('map.html');
  })

  router.get('/cases', function (req, res) {
    res.render('cases.html');
  })

  router.get('/contact', function (req, res) {
    res.render('contact.html');
  })

  router.get('/coperation', function (req, res) {
    res.render('coperation.html');
  })  

  router.get('/support', function (req, res) {
    res.render('support.html');
  })  

  server.use(router);
};
