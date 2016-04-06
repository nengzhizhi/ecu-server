var pathConfig = require('../path.json');

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();

  for (var key in pathConfig) {
    if (pathConfig[key].method == 'get') {
      router.get(key, function (req, res) {
        res.render(pathConfig[req.url].templateUrl);
      })
      server.use(router);
    }
  }
  
  router.get('/case', function (req, res) {
    if (!req.query.id) {
      res.render('cases.html');
    } else {
      var CaseModel = server.models.Case;
      var id = req.query.id;

      CaseModel.findOne({
        where: { id: id }
      }, function (err, item) {
        if (!item)
          return res.render('cases.html');

        var detail = [];
        for (var i = 0; i <= 4; i++) {
          var cursor_str = (i + 1).toString();
          detail.push({
            photo: eval('item.photo_url_' + cursor_str),
            explanation: eval('item.explanation_' + cursor_str)
          });
        }

        res.render('template/case-detail.html', {
          info: item,
          detail: detail
        });
      })
    }
  })

  router.get('/m/case_detail', function (req, res) {
    if (!req.query.id) {
      res.render('mobile/case_list.html');
    } else {
      var CaseModel = server.models.Case;
      var id = req.query.id;

      CaseModel.findOne({
        where: { id: id }
      }, function (err, item) {
        if (!item)
          return res.render('mobile/case_list.html');

        var detail = [];
        for (var i = 0; i <= 4; i++) {
          var cursor_str = (i + 1).toString();
          detail.push({
            photo: eval('item.photo_url_' + cursor_str),
            explanation: eval('item.explanation_' + cursor_str)
          });
        }

        res.render('mobile/case_detail.html', {
          info: item,
          detail: detail
        });
      })
    }
  })

  server.use(router);
// //--------------------------------------------------------------------
//   router.get('/mobile', function (req, res) {
//     res.render('mobile/mobile.html');
//   })

//   router.get('/case_detail', function (req, res) {
//     res.render('mobile/case_detail.html');
//   })
// //--------------------------------------------------------------------
//   router.get('/', function (req, res) {
//     res.render('index.html');
//   })

// 	router.get('/index', function (req, res) {
// 		res.render('index.html');
// 	})

// 	router.get('/about_us', function (req, res) {
// 		res.render('about_us.html');
// 	})

//   router.get('/why_ecu', function (req, res) {
//   	res.render('why_ecu.html');
//   })

//   router.get('/brand', function (req, res) {
//     res.render('brand.html');
//   })

//   router.get('/map', function (req, res) {
//     res.render('map.html');
//   })

//   router.get('/cases', function (req, res) {
//     var CaseModel = server.models.Case;

//     CaseModel.find(function (err, cases) {
//       res.render('cases.html', { items: cases });
//     })
//   })

//   router.get('/contact', function (req, res) {
//     res.render('contact.html');
//   })

//   router.get('/coperation', function (req, res) {
//     res.render('coperation.html');
//   })  

//   router.get('/support', function (req, res) {
//     res.render('support.html');
//   })  

//   router.get('/case', function (req, res) {
//     if (!req.query.id) {
//       res.render('cases.html');
//     } else {
//       var CaseModel = server.models.Case;
//       var id = req.query.id;

//       CaseModel.findOne({
//         where: { id: id }
//       }, function (err, item) {
//         if (!item)
//           return res.render('cases.html');

//         var detail = [];
//         for (var i = 0; i <= 4; i++) {
//           var cursor_str = (i + 1).toString();
//           detail.push({
//             photo: eval('item.photo_url_' + cursor_str),
//             explanation: eval('item.explanation_' + cursor_str)
//           });
//         }

//         res.render('template/case-detail.html', {
//           info: item,
//           detail: detail
//         });
//       })
//     }
//   })

//   server.use(router);
};
