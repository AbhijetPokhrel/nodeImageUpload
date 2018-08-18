function onImageSelected(elem) {
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
  console.log("elem " + elem.src);
}


var loadimg = function(url) {
  var divelem = document.getElementById("ckd123boxdivup555");
  var divleminner = document.getElementById("ckd123boxdivup555").innerHTML;
  url = "<div><img class=\"ckd123boxup555left ckd123boxup555img\" src=\"" + url + "\" onclick=\"onImageSelected(this)\"></img></div>";
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

  var request = new Request(window.CKEDITOR.extraData.BASE_URL+'/admin/uploadmedia', params);

  displayCKImgMsg("Uploading Image...");
  fetch(request)
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      displayCKImgMsg("Image Uploaded...");
      loadimg(window.CKEDITOR.extraData.BASE_URL + JSON.parse(data).name);
    }).catch(function(error) {
      displayCKImgMsg("Error Occuerd...");
    });
}

function loadAllImagesFromPost() {
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

  var request = new Request(window.CKEDITOR.extraData.BASE_URL+'/admin/getpostimages', params);

  displayCKImgMsg("Loading Images...");
  fetch(request)
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      JSON.parse(data).forEach(function(item) {
        loadimg(window.CKEDITOR.extraData.BASE_URL + item.name);
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


CKEDITOR.dialog.add('neptechimgDialog', function(editor) {
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
  html += '<div style="color:inherit;">Upload a Image</div>';
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
      for (var i = 0; i < selectedImages.length; i++) {
        selectedImages[i].style.maxWidth='700px';
        selectedImages[i].style.margin="auto";
        selectedImages[i].style.display="block";
        html += selectedImages[i].outerHTML;
      }
      html += '</div>';
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
      loadAllImagesFromPost();
    }
  };
});
