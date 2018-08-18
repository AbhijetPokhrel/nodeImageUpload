"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var index = exports.index = function index(knode, writer) {
    writer.write(knode.view("views/welcome.html", { msg: { txt: "Hello !! " } }));
};