CKEDITOR.plugins.add('headlink', {
  requires: 'widget',
  icons: 'headlink',

  init: function(editor) {

    editor.addCommand('headlink', {
      refresh: function(editor, path) {
        console.log("path : " + path + "  elem : " + elem);
      },
      exec: function(editor) {
        console.log("Sel html : " + getselhtml(this,editor));
      }
    });

    editor.ui.addButton('Headlink', {
      label: 'Highlight Text',
      command: 'headlink',
      toolbar: 'insert'
    });
  }
});

function getselhtml(cmd,editor) {
  var selection = editor.getSelection();
  if (selection) {
    var bookmarks = selection.createBookmarks(),
      range = selection.getRanges()[0],
      fragment = range.clone().cloneContents();

    selection.selectBookmarks(bookmarks);

    var retval = "",
      childList = fragment.getChildren(),
      childCount = childList.count();
    for (var i = 0; i < childCount; i++) {
      var child = childList.getItem(i);
      child.setText("<span>asdfasdf111</span>");
      retval += (child.getOuterHtml ?
        child.getOuterHtml() : child.getText());
    }
    cmd.setState(CKEDITOR.TRISTATE_ON);
    cmd.exec();
    cmd.setState(CKEDITOR.TRISTATE_DISABLED);
    cmd.exec();
    return retval;
  }
}
