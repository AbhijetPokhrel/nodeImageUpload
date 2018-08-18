exports.onRederRequestArrived = function (render, data) {
    return require('ejs').render(render,data);
}