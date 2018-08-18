
CKEDITOR.plugins.add( 'neptechimg', {

	icons: 'gallery',

	init: function( editor ) {

		editor.addCommand( 'neptechimg', new CKEDITOR.dialogCommand( 'neptechimgDialog',
	  {allowedContent: 'img { height, width, max-width, display, margin } [ !src, alt ]; div(!neptechimgholder){width,background};'} ) );

		editor.ui.addButton( 'Gallery', {

			label: 'Insert Image',

			command: 'neptechimg',

			toolbar: 'insert'
		});


		CKEDITOR.dialog.add( 'neptechimgDialog', this.path + 'dialogs/neptechimg.js' );
	}
});
