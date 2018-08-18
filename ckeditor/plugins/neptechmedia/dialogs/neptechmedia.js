var CKMIME_TYPES_VDO={
  "mp4":"video/mp4",
  "m4v":"video/mp4",
  "flv":"video/x-flv",
  "3gp":"video/3gpp",
  "ogv":"video/ogg",
  "webm":"video/webm"
};

var CKMIME_TYPES_AUDIO={
  "mp1":"audio/mpeg",
  "mp2":"audio/mpeg",
  "mpeg":"audio/mpeg",
  "mp3":"audio/mpeg",
  "acc":"audio/acc",
  "m4a":"audio/mp4",
  "wav":"audio/wav"
}

var CK_MEDIA_TYPE={
  "UNKNOWN":0,
  "VIDEO":1,
  "AUDIO":2
}

function getCKmimeType(name){
  var ext=name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2);
  console.log("extension : "+ext);

  var mime= CKMIME_TYPES_VDO[ext];

  if(mime!=undefined){
    //video
    return {type:CK_MEDIA_TYPE.VIDEO,mime:mime};
  }

  //not video
  mime=CKMIME_TYPES_AUDIO[ext];
  if(mime!=undefined){
    //AUDIO
    return {type:CK_MEDIA_TYPE.AUDIO,mime:mime};
  }

  return {type:CK_MEDIA_TYPE.UNKNOWN};
}
function onMediaSelected(elem) {
  if (elem.className.indexOf("ckd123boxup555sel") != -1) {
    //already selected
    elem.className = elem.className.replace("ckd123boxup555sel", "");
  } else {
    //not selected select now
    elem.className += " ckd123boxup555sel";
  }

  var selected_count = document.getElementsByClassName("ckd123boxup555sel").length;
  if (selected_count == 0) {
    document.getElementById("ckd123boxinfoup555").innerHTML = "No Image Selected";
  } else {
    document.getElementById("ckd123boxinfoup555").innerHTML = selected_count + " Images Selected";
  }
}


var loadmedia = function(name) {
  var divelem = document.getElementById("ckd123boxdivup555");
  var divleminner = document.getElementById("ckd123boxdivup555").innerHTML;
  var orginal_name=name.split('/').pop().split('#')[0].split('?')[0];
  orginal_name=orginal_name.replace("netptectimg_","");
  orginal_name=orginal_name.replace(new RegExp("&D115-", "ig"), " ");
  var ico=null;

  switch(getCKmimeType(name).type){

    case CK_MEDIA_TYPE.VIDEO:
      ico='<i id="ckmedaifab" class="fas fa-video"></i>';
      break;

    case CK_MEDIA_TYPE.AUDIO:
      ico='<i id="ckmedaifab" class="fas fa-volume-up" aria-hidden="true"></i>';
      break;

    default:
      ico='<i id="ckmedaifab" class="fas fa-file" aria-hidden="true"></i>';

  }

  url = "<div onclick='onMediaSelected(this)' data-name="+name+"  id='ckmediacontainer' style='margin:10px; padding:10px;'>"+
          "<div style='float:left'>"+ico+"</div>"+
          "<div style='padding-top:30px;'>"+
            "<strong>"+
            orginal_name+
            "</strong>"+
          "<div>"+
      "</div>";
  console.log("addding image to list.." + url);
  divleminner = divleminner + url;
  divelem.innerHTML = divleminner;
}

function onFileSelected(elem) {
  console.log(elem.files[0]);
  var formData = new FormData();
  formData.append("user_id", window.CKEDITOR.extraData.user_id);
  formData.append("post_id", window.CKEDITOR.extraData.post_id); // number 123456 is immediately converted to a string "123456"
  formData.append("media", elem.files[0]);
  formData.append("type", "image");
  var headers = {};
  headers["x-access-token"] = window.CKEDITOR.extraData.token;

  var params = {
    method: "post",
    mode: 'cors',
    redirect: 'follow',
    body: formData,
    headers: headers
  };

  var request = new Request(window.CKEDITOR.extraData.BASE_URL+'/admin/mediaupload', params);

  displayCKImgMsg("Uploading Medai...");
  fetch(request)
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      displayCKImgMsg("Media Uploaded...");
      loadmedia(JSON.parse(data).name);
    }).catch(function(error) {
      displayCKImgMsg("Error Occuerd...");
    });
}

function loadAllMediaFromPost() {
  var formData = new FormData();
  formData.append("user_id", window.CKEDITOR.extraData.user_id);
  formData.append("post_id", window.CKEDITOR.extraData.post_id); // number 123456 is immediately converted to a string "123456"
  var headers = {};
  headers["x-access-token"] = window.CKEDITOR.extraData.token;

  var params = {
    method: "post",
    mode: 'cors',
    redirect: 'follow',
    body: formData,
    headers: headers
  };



  var request = new Request(window.CKEDITOR.extraData.BASE_URL+'/admin/getpostmedias', params);

  displayCKImgMsg("Loading Medias...");
  fetch(request)
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      JSON.parse(data).forEach(function(item) {
        loadmedia(item.name);
      });
    }).catch(function(error) {
      displayCKImgMsg("Error Occuerd...");
    });
}

function displayCKImgMsg(message, iserr) {
  var loading = document.getElementById("ckd123boxloadingup555");
  loading.innerHTML = message;
  loading.style.display = "block";
  setTimeout(function() {
    loading.style.display = "none";
  }, 2000);
}


CKEDITOR.dialog.add('neptechmediaDialog', function(editor) {
  console.log("editor lang : " + JSON.stringify(editor.lang.common));
  var upload_id = "ckd123boximgup555";
  var grid_img = "ckd123boxdivup555";
  var info_id = "ckd123boxinfoup555";
  var loading = "ckd123boxloadingup555";
  var html = '';
  html += '<div><strong id="' + loading + '" style="display:none;">Uploading Image....</strong></div>'
  html += '<div><strong id="' + info_id + '"></strong></div>';
  html += '<div class="' + grid_img + ' ckd123boxup555left" id="' + grid_img + '" ></div>';
  html += '<div id="ckd123boximgup555upload-btn-wrapper">';
  html += '<div style="color:inherit;">Upload a Media</div>';
  html += '<input class="row" type="file" id="' + upload_id + '" onchange="onFileSelected(this)"></input>';
  html += '</div>'

  return {
    title: 'Edit Simple Box',
    minWidth: 400,
    minHeight: 400,
    contents: [{
      id: 'info',
      elements: [{
        type: 'html',
        html: html
      }]
    }],
    onOk: function() {
      var html = '';
      html += '<div class="neptechimgholder" style="width:100%">';
      var selectedImages = document.getElementsByClassName("ckd123boxup555sel");
      var media;
      console.log("selected medias length "+selectedImages.length);
      for (var i = 0; i < selectedImages.length; i++) {
        media=getCKmimeType(selectedImages[i].dataset.name);
        switch(media.type){
          case CK_MEDIA_TYPE.VIDEO:
            html+='<video width="320" height="240" controls style="display: block;margin: auto;">';
            html+='<source src="'+window.CKEDITOR.extraData.BASE_URL+selectedImages[i].dataset.name+'" type="video/mp4">';
            html+='Your Browser doesnot support video';
            html+='</video>';
            break;

          case CK_MEDIA_TYPE.AUDIO:
            ico='<i id="ckmedaifab" class="fas fa-volume-up" aria-hidden="true"></i>';
            break;

          default:
            ico='<i id="ckmedaifab" class="fas fa-file" aria-hidden="true"></i>';
        }
      }
      html += '</div>';
      console.log("selected medias length "+selectedImages.length);
      if (selectedImages.length != 0) {
        editor.insertHtml(html);
        console.log("adding htmls : "+html);
      } else {
        editor.insertHtml('');
          console.log("not adding html");
      }

    },
    onLoad: function() {
      document.getElementById(loading).style.display = "none";
      loadAllMediaFromPost();
    }
  };
});
