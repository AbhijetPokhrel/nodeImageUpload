
exports.REQ_TYPE={
  "NORMAL":1,
  "FILE":2,
  "RANGE":3
}

//get the type of request
exports.getType=function(global){
  if(global.req.url.startsWith("/public")){
    //check if the range header is present
    if(global.req.headers.range!=undefined){
      return exports.REQ_TYPE.RANGE;
    }else{
      return exports.REQ_TYPE.FILE
    }


  }else{
    return exports.REQ_TYPE.NORMAL;
  }
}
