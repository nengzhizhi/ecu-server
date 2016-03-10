module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  // router.get('/', server.loopback.status());

	router.get('/index', function (req, res) {
		res.render('index.html');
	})

	router.get('/case', function (req, res) {
		res.render('case.html');
	})

  router.get('/case_detail', function (req, res) {
  	res.render('case_detail.html');
  })

  router.get('/about', function (req, res) {
    res.render('about.html');
  })

  router.get('/brand', function (req, res) {
    res.render('brand.html');
  })

  server.use(router);
};
