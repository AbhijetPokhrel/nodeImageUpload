"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImage = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _webpConverter = require("webp-converter");

var jpgFormats = ["JPG", "JPEG"];
/*
  uploadImage is called when valid file as per defined from the config
  file is uploaded to '/images' url
*/
var uploadImage = exports.uploadImage = function uploadImage(knode, writer) {
  //check if the image is valid
  validateImage(knode.fields.media.name).then(function (ext) {
    //validate the heaers now
    return validateHeaders(knode);
  }).then(function (name) {
    //now save the file to new name as webp
    return saveToWebp(knode, name);
  }).then(function (res) {
    //give the response to the user
    writer.write(JSON.stringify({
      msg: "Image uploaded successfully.."
    }));
  }).catch(function (err) {
    writer.err(JSON.stringify({
      msg: err
    }));
  });
};

/*
  -returns a promise object
  -Checks if the uploaded image is a valid file
  -Makes sure the image is jpg Format
  -resolves with file extension information if criteria is met
*/
function validateImage(name) {
  return new Promise(function (resolve, reject) {
    var ext = getFileExtension(name); //get extensions info
    if (!ext) {
      reject("Invalid file");
      return;
    }

    for (var i = 0; i < jpgFormats.length; i++) {
      if (jpgFormats[i].toLowerCase().localeCompare(ext.name.toLowerCase()) == 0) {
        resolve(ext);
        return;
      }
    }reject("Invalid Image format " + ext.name);
  });
}

/*
  -returns a promise object
  -Checks if the uploaded image has x-test header
  -Makes sure the header is not an object
  -resolves with file name associated to x-test header
*/
function validateHeaders(knode) {
  return new Promise(function (resolve, reject) {
    if (knode.req.headers["x-test"]) {
      if (_typeof(knode.req.headers["x-test"]) === 'object') reject("Not a valid header");else resolve(knode.req.headers["x-test"]);
    } else reject("No x-test header present");
  });
}

/*
  Saves the uploaded image to public folder as webp file
*/
function saveToWebp(knode, name) {

  return new Promise(function (resolve, reject) {
    name = generateFileName(name);
    (0, _webpConverter.cwebp)(knode.fields.media.path, knode.app.PUBLIC_DIR + "/" + name + ".webp", "-q 80", function (status) {
      //if exicuted successfully status will be '100'
      //if exicuted unsuccessfully status will be '101'
      if (status.startsWith("100")) resolve(status);else reject("Could not convert the image to webp");
    });
  });
}

function generateFileName(name) {
  console.log("file : " + name);
  return name + Date.now();
}

//returns the file extension information
function getFileExtension(name) {
  var index = name.lastIndexOf(".");
  if (index == -1) return; //return if no '.' is found

  if (index + 1 >= name.length) return; //return if the '.' is the last index

  return {
    index: index + 2, //index for extension
    name: name.slice(index + 1, name.length)
  };
}