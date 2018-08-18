'use strict';

var http = require('http');
var dt = require("./dateModule");
var routes = require("./components/routes/routes.js");
routes.init_routes();
var configs=getAppConfigs();
var httpparser = require("./components/http/httpparser.js");


http.createServer(function(req, res) {
  httpparser.evaluate(req, res, configs, routes.ROUTES);
}).listen(configs.L_PORT);
console.log("Listening at : "+configs.L_PORT);

//get the app configs
function getAppConfigs() {
  var fs = require('fs');
  if (fs.existsSync("./config/env.json")) {
    return JSON.parse(fs.readFileSync("./config/env.json", 'utf8'));
  } else {
    throw "/config/env.json file doesnot exists";
  }
}
