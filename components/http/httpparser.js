exports.evaluate = function(req, res, configs, routes) {
  let responder = require("./responder.js");
  let request=require("./request.js")

  let global = {};
  global["req"] = req;
  global["res"] = res;
  global["sendFile"] = responder.sendFile;


  global["app"] = configs;

  global["log"]=function(msg){
    console.log(msg);
  }
  global["err"]=function(err){
    console.log(err);
  }

  // console.log("\n\n");
  // console.log("****________________________________________________________________***");
  // console.log("request : " + req.url);

//RESPOND AS PER THE REQUEST TYPE
  switch(request.getType(global)){

    case(request.REQ_TYPE.FILE):
      responder.sendFile(global, "." + req.url);
      return;
    case(request.REQ_TYPE.RANGE) :
      responder.respondeRange(global,"."+req.url);
      return;
  }

  //NORMAL REQUEST FROM HERE
  if (routes[req.url] == undefined) { //the route is not there
    // console.log(req.url + "url not found");
    responder.routeNotFound(global);
  } else { //route is there now check the method
    if (req.method.toLowerCase().localeCompare("options") == 0) {
      responder.respond_OPTIONS(global);
      return;
    }
    if (req.method.toLowerCase().localeCompare(routes[req.url].method) == 0) {
      // console.log("route found");
      /*
       * Once the route is found go throught the middleware
       * for further processiong
       */

      getMethodParams(global, function(iserr,fields) {
        if(iserr){
          // console.error(fields.reason);
          responder.respondHTTP(global,fields.reason,fields.err_code);
          return;
        }
        global["fields"] = fields;

        if (routes[req.url].middleware == undefined) {
          routes[req.url]['middleware'] = [];
          routes[req.url].middleware["default"] = true;
          routes[req.url].middleware["elems"] = [];
        }
        if (routes[req.url].middleware["default"] == undefined) {
          routes[req.url].middleware["default"] = true;
        }
        if (routes[req.url].middleware["elems"] == undefined) {
          routes[req.url].middleware["elems"] = [];
        }

        if (routes[req.url].middleware.default == true) {
          routes[req.url]['middleware'].elems.push("components/middleware/csrf.js");
          routes[req.url]['middleware'].elems.push("components/middleware/script.js");
          routes[req.url]['middleware'].elems.push("components/middleware/xss.js");
        }
        global["extraParams"] = {}
        navigateMiddleware(routes[req.url].middleware.elems, 0, global, function() {
          responder.onValidRequestArrived(global, routes[req.url]);
        });

      });
    } else {
      // console.log("method not allowed");
      responder.methodNotAllowed(global);
    }

  }
}

/*
 *this fuctions will navigate through each and every middleware
 */
function navigateMiddleware(arr, count, knode, callback) {

  // console.log("hitting " + arr[count]);
  require("../../" + arr[count]).middleware(knode, function(knode1) {
    // console.log("response from : " + arr[count]);
    count++;
    if (knode1 != undefined) {
      knode = knode1;
    }
    if (count < (arr.length)) {
      navigateMiddleware(arr, count, knode, callback);
    } else {
      callback();
    }
  });
}

/*
 * this function will generate fields for pos,get...etc...
 * this makes user no ned to take care of form fields themselves
 */
function getMethodParams(global, callback) {
  let formidable = require('formidable');
  let form = new formidable.IncomingForm();
  form.maxFileSize=global.app.maxUploadSize;
  let fs = require('fs');

  form.parse(global.req, function(err, fields, files) {
    if(err){
      callback(true,{reason:"too big file",err_code:413});
      return;
    }
    for (let file in files) {
      fields[file] = files[file];
      fields[file]["save"] = function(dir, onUploaded) {
        // console.log(JSON.stringify(fields[file]));
        require('fs').rename(fields[file].path, dir + "/" + fields[file].name, function(err) {
          onUploaded();
        });
      }
    }
    callback(false,fields);
  });
}
