require("./components/database/Table.js")

let schema=require("./components/database/Schema.js");
let fs=require('fs');

let files=fs.readdirSync('./migrations/');

loadSchema(0);

function loadSchema(count){
  if(count==files.length)return;
  let migration=require("./migrations/"+files[count]);
  try {
    schema.create(migration.getTable(),()=>{
      loadSchema(count+1);
    });
  } catch (e) {
    console.log(e)
    console.log(" - error migrating "+files[count]);
    loadSchema(count+1);
  }
}
