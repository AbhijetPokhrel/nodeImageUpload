var fs = require('fs');
exports.ROUTES = {};

exports.init_routes = function() {
  var routes = "";
  fs.readdirSync('./routes/').forEach(function(file) {
    routes = JSON.parse(fs.readFileSync('./routes/' + file, 'utf8'));
    evaluateRoute(routes);
  });
}

function evaluateRoute(routes) {
  for (var i = 0; i < routes.length; i++) {
    eval(routes[i], []);
  }
}

function eval(route, middlewares) {
  if (route.type != undefined) {
    if (route.type.localeCompare("group") == 0) {
      addGroupRoute(route, middlewares)
    }
  } else {
    if (middlewares.length > 0) {
      if (route.middlewares == undefined) {
        route["middlewares"] = [];
      }
      for (var i = middlewares.length; i >0; i--) {
        route.middlewares.unshift(middlewares[i-1]);
      }
    }
    addRoute(route);
  }
}

function addRoute(route) {
  var r = {
    method: route.method,
    middleware: {},
    redirect: route.redirect
  }
  if (route.middlewares != undefined) {
    r.middleware["elems"] = route.middlewares;
  }
  exports.ROUTES[route.name] = r;
}

function addGroupRoute(route, middlewares) {
  for (var i = 0; i < route.middlewares.length; i++) {
    middlewares.push(route.middlewares[i]);
  }
  var r = {};
  for (var i = 0; i < route.routes.length; i++) {
    eval(route.routes[i], middlewares);
  }
}
