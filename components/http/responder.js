"use strict";

exports.onValidRequestArrived = function(global, module) {
  var redirect = module.redirect.split('@');
  global["view"] = fileParse;

  try {
    require("../../.dist/" + redirect[0] + ".js")[redirect[1]](global, new Writer(global.req, global.res));
  } catch (err) {
    global.res.writeHead(500, {
      'Content-Type': 'text/html'
    });
    var util = require('util');
    global.res.write(JSON.stringify({
      error: util.inspect(err)
    }));
    global.res.end();
  }
}

exports.methodNotAllowed = function(global) {
  global.res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  global.res.write(JSON.stringify({
    err: "method not allowed",
    url: global.req.url,
    req: global.req.method
  }));
  global.res.end();
  // console.log("done");
}

exports.routeNotFound = function(global) {
  global.res.writeHead(404, {
    'Content-Type': 'text/json'
  });
  global.res.write(JSON.stringify({
    err: "URL not found",
    url: global.req.url
  }));
  global.res.end();

}

exports.respondHTTP = function(global, reason, code) {
  global.res.writeHead(code, {
    'Content-Type': 'text/plain'
  });
  global.res.write(JSON.stringify({
    err: reason
  }));
  global.res.end();
}

/*
 *This functin will respond to the cross origin requests
 */
exports.respond_OPTIONS = function(global) {
  // console.log("responding options");
  global.res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "x-access-token",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "text/html"
  });
  global.res.end();
}

//send file requests
exports.sendFile = function(global, filePath) {
  filePath=filePath.split('#')[0].split('?')[0];
  const fs = require('fs');

  try {
    if (!fs.lstatSync(filePath).isDirectory()) {
      fs.exists(filePath, function(exists) {
        if (exists) {
          var fileName = filePath.split('/').pop();
          global.res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + fileName
          });
          fs.createReadStream(filePath).pipe(global.res);
        } else {
          exports.routeNotFound(global);
        }
      });
    } else {
      exports.routeNotFound(global);
    }

  } catch (err) {
    exports.routeNotFound(global);
  }


}

exports.respondeRange = function(global, filePath) {

  const fs = require('fs');
  filePath=filePath.split('#')[0].split('?')[0];

  try {
    if (!fs.lstatSync(filePath).isDirectory()) {
      var range = getRanges(global.req);
      var stat = fs.statSync(filePath);
      var buff = 2 * 1024 * 1024;

      // console.log(range);
      if (range.start == undefined) {
        //end the response
        global.res.end();
        return;
      }

      if (stat.size < range.start) {
        //end the response
        global.res.end();
        return;
      }

      if (range.end == undefined) range.end = range.start + buff;

      if (stat.size < range.end) {
        range.end = stat.size;
      }

      // console.log(range);
      var fileName = filePath.split('/').pop();
      var MIME=getMimeType(fileName.toLowerCase());

      if(MIME==undefined){
        //respond as file
        exports.sendFile(global,filePath);
        return;
      }
      //respond the reqests now
      var responseHeaders = {};
      // Indicate the current range.
      responseHeaders['Content-Range'] = 'bytes ' + range.start + '-' + (range.end-1) + '/' + stat.size;
      responseHeaders['Content-Length'] = -1;
      responseHeaders['Content-Type'] = MIME;
      responseHeaders['Accept-Ranges'] = 'bytes';
      responseHeaders['Cache-Control'] = 'no-cache';
      responseHeaders["Connection"]='close';

      global.res.writeHead(206, responseHeaders);
      fs.createReadStream(filePath,range).pipe(global.res,{end:true});


    } else {
      // console.log("No such dir "+filePath);
      exports.routeNotFound(global);
    }

  } catch (err) {
    // console.log(err);
    exports.routeNotFound(global);
  }

}

const MIME_TYPES={
  "mp4":"video/mp4",
  "m4v":"video/mp4",
  "flv":"video/x-flv",
  "3gp":"video/3gpp",
  "ogv":"video/ogg",
  "webm":"video/webm",
  "mp1":"audio/mpeg",
  "mp2":"audio/mpeg",
  "mpeg":"audio/mpeg",
  "mp3":"audio/mpeg",
  "acc":"audio/acc",
  "m4a":"audio/mp4",
  "wav":"audio/wav"
}


function getMimeType(name) {
  var ext=name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2);
  return MIME_TYPES[ext];
}


function getRanges(req) {
  var range = req.headers.range;
  // console.log("range : " + range);

  var array = range.split(/bytes=([0-9]*)-([0-9]*)/);

  var start = parseInt(array[1]);
  var end = parseInt(array[2]);
  var result = {
    start: isNaN(start) ? 0 : start,
    end: isNaN(end) ? undefined : end
  };

  return result;
}

function fileParse(name, data) {
  var fs = require('fs');
  if (fs.existsSync("./app/" + name)) {
    return require("../../render.js").onRederRequestArrived(
      fs.readFileSync("./app/" + name, 'utf8'),
      data);
  } else {
    throw "file doesnot exists app/" + name;
  }
}

function Writer(req, res) {
  this.res = res;
  this.req = req;
  this.write = function(msg) {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': "*",
      'Content-Type': 'text/html'
    });
    res.write(msg);
    res.end();
  };
  this.err = function(msg) {
    res.writeHead(500, {
      'Access-Control-Allow-Origin': "*",
      'Content-Type': 'text/json'
    });
    res.write(msg);
    res.end();
  }
}
