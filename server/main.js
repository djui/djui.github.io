var sys = require("sys")
var router = require("./vendor/router/router").getRouter()
var static = require("./vendor/static/static").static

exports.start = function(port, host) {
  return router.listen(port, host)    
}

exports.end = function() {
  return server.end()
}

router.get("/backend", backend)
router.get("/.*", function(req, res) {
  static(__dirname+"/../client", req, res)
})

function backend(req, res) {
  return res.simpleHtml(200, "Backend")
}
