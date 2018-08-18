exports.create = function(table,callback) {
  return getCreateQuery(table,callback);
}

function getCreateQuery(table,callback) {
  let query = 'CREATE TABLE ' + table.name + " (";

  for (let i = 0; i < table.colomns.length; i++) {
    query += table.colomns[i].name;
    for (let j = 0; j < table.colomns[i].attributes.length; j++) {
      query += " " + table.colomns[i].attributes[j];
    }

    if (table.colomns.length > (i + 1))
      query += ","
    else
      query += ");"
  }

  let qb = require('node-querybuilder').QueryBuilder(getAppConfigs().database.CONFIG, 'mysql', 'single');
  qb.query(query, function(err, res) {
    // qb.disconnect();
    if (err) {
      console.log("\n\n"+err.sqlMessage);
      console.log(" - error creating " + table.name);
      // console.log(err);
    } else {
      console.log(" - created table : " + table.name);
    }
    callback();
  });

}



//get the app configs
function getAppConfigs() {
  let fs = require('fs');
  if (fs.existsSync("./config/env.json")) {
    return JSON.parse(fs.readFileSync("./config/env.json", 'utf8'));
  } else {
    throw "/config/env.json file doesnot exists";
  }
}
