var sys = require("sys")
var http = require("http")
var repl = require("repl")
var server = require("./server/main")

var port = 8002
var host = "127.0.0.1"

//////////////////////////////////////////////////////////////////////////////
process.addListener("uncaughtException", function (err) {
  sys.puts("[node] Caught exception: "+err)
})

process.addListener("SIGINT", function () {
  sys.puts("[node] Shutting down...")
  process.exit(0)
})

if (process.argv[2] == "-i" || process.argv[2] == "--interactive")
  repl.start()
//////////////////////////////////////////////////////////////////////////////

server.start(port, host)
sys.puts("[node] Server listening at http://" + host + ":" + port + "/")
