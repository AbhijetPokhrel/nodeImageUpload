var routes = require("./components/routes/routes.js");
routes.init_routes();

console.log("\n\n________YOUR ROUTES__________\n" );

for (var route in routes.ROUTES) {
    console.log("route:  %s| \tmethod:  %s| \tredirect: %s|", route, 
    routes.ROUTES[route].method,routes.ROUTES[route].redirect);
}

