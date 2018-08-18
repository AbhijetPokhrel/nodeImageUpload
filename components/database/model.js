exports.BUILDER = function () {
    var BUILDER={DB:undefined};
    var db = getDatabasePropertise();
    if (db.TYPE.toLowerCase().localeCompare("mysql") == 0) {
//        console.log("db req user: " + db.CONFIG.user);
        BUILDER.DB = require('node-querybuilder').QueryBuilder(db.CONFIG, 'mysql', 'single');
    } else {
        throw "Database not supported" + db.TYPE;
    }
    return BUILDER;
}

function getDatabasePropertise() {
    return JSON.parse(require('fs').readFileSync("./config/env.json")).database;
}
