
CKEDITOR.plugins.add( 'neptechmedia', {

	icons: 'media',

	init: function( editor ) {

		editor.addCommand( 'neptechmedia', new CKEDITOR.dialogCommand( 'neptechmediaDialog',
	  {allowedContent: 'video[ width,height,controls ] {display,margin}; source[!src,!type] ; div(!neptechimgholder){width};'} ) );

		editor.ui.addButton( 'Media', {

			label: 'Insert Media',

			command: 'neptechmedia',

			toolbar: 'insert'
		});


		CKEDITOR.dialog.add( 'neptechmediaDialog', this.path + 'dialogs/neptechmedia.js' );
	}
});
