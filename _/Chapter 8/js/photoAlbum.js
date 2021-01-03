$(document).ready(function()
{
	albums.initialize();
});


var albums = 
{
	jsonAlbums : null,
	currentAlbum : null,
	currentPictureId : null,
	initialize : function()
	{
		$.getJSON( "albums.json", function(data) 
		{
			albums.jsonAlbums = data;
			albums.fillAlbumNames();
			albums.addEventHandlers();
		});
	},
	fillAlbumNames : function()
	{
		var albumNames = [];
		$.each(this.jsonAlbums, function(key, album)
		{
			albumNames.push('<h4 class="ui-widget-header album" data-id="' + album.id + '">' + album.albumName + ' </h4>');
		});
		$('#albumNames').html(albumNames.join(''));
	},
	addEventHandlers : function()
	{
		$('.album').on('click', function()
		{
			albums.displayAlbum($(this).data('id'));
		});

		$('#albumPics').sortable(
		{
			handle : '.ui-widget-header',
			placeholder: "ui-state-highlight",
			cursor:'move'
		});		
		
		$( "#dialogEdit" ).dialog(
		{
			resizable: false,
			autoOpen : false,
			modal: true,
			buttons: 
			{
				Save: function() 
				{
					albums.editImage();
				},
				Cancel: function() 
				{
					$('#txtImageName').val('');
					albums.currentPictureId = null;
					$(this).dialog( "close" );
				}
			}
		});

		$( "#dialogDelete" ).dialog(
		{
			resizable: false,
			autoOpen : false,
			modal: true,
			buttons: 
			{
				Delete: function() 
				{
					albums.deleteImage();
				},
				Cancel : function()
				{
					albums.currentPictureId = null;
					$(this).dialog( "close" );
				}
			}
		});

		$( "#dialogZoom" ).dialog(
		{
			resizable: false,
			autoOpen : false,
			modal: true,
			position : "top",
			width:430,
			show : 'scale',
			hide : 'scale'
		});

		$('ul#albumPics').on('click', function(event) 
		{
			var target = $(event.target);
			if(target.is('a.ui-icon-pencil') ) 
			{
				var pictureId = target.data('id');
				var pictureName = target.data('name');
				albums.currentPictureId = pictureId;
				$('#txtImageName').val(pictureName);
				$('#dialogEdit').dialog('open');
			} 
			else if(target.is('a.ui-icon-trash') ) 
			{
				var pictureId = target.data('id');
				albums.currentPictureId = pictureId;
				$("#dialogDelete").dialog('open');
			} 
			else if(target.is('img.large') ) 
			{
				var largeImagePath = target.parent().attr('href');
				$('#dialogZoom').html('<img src="' + largeImagePath + '">').dialog('open');
			}
			return false;
		});

		$('#btnSave').button().on('click', function()
		{
			albums.saveNewSequence();
		});
		
		
	},
	displayAlbum : function(albumId)
	{
		$('#albumPics').empty();
		$('#btnSave').hide();
		this.currentAlbum = albumId;
		var listItems = '';
		for(var i = 0; i < this.jsonAlbums.length; i++)
		{
			if(this.jsonAlbums[i].id == albumId)
			{
				if(this.jsonAlbums[i].pictures.length > 0)
				{
					var allPictures = this.jsonAlbums[i].pictures;
					/* sort pictures by sequence before displaying*/
					allPictures.sort(function(a,b)
					{
						return a.sequence - b.sequence;
					});
					$.each(allPictures, function(key, picture)
					{
						listItems+= '<li class="ui-widget-content" id="picture_'+ picture.id +'">';
							listItems+= '<h5 class="ui-widget-header"><span id="pictureName_'+  picture.id +'">'+ picture.imageTitle + '</span>';
								listItems+= '<div class="icons">';
									listItems+= '<a href="#" title="Edit?" class="ui-icon ui-icon-pencil" data-id="' + picture.id +'" data-name="' + picture.imageTitle + '"></a> ';
									listItems+= '<a href="#" title="Delete?" class="ui-icon ui-icon-trash" data-id="' + picture.id +'"></a>';
								listItems+= '</div>';
							listItems+= '</h5>';
							listItems+= '<a href="' + picture.imageLarge + '">';
								listItems+= '<img src="' + picture.imageThumb + '" width="150" height="150" class="large">';
							listItems+= '</a>';
						listItems+= '</li>';
					});
					$('#btnSave').show();
				}
				else 
				{
					listItems+= '<li class="ui-widget-content">No pictures in this album</li>';
				}
				$('#numImages').text(this.jsonAlbums[i].pictures.length + ' pictures');
				$('#albumPics').html(listItems);
				break;
			}
		}
	},
	editImage : function()
	{
		var editImageRequest = $.ajax(
		{
			url : 'ajaxAlbum.php',
			type: "POST",
			data: { action : 'edit', albumId: albums.currentAlbum, pictureId: albums.currentPictureId, newImageName : $('#txtImageName').val() }
		});

		editImageRequest.done(function(data)
		{
			$.getJSON( "albums.json", function( data ) 
			{
				albums.jsonAlbums = data;
				$('#pictureName_' + albums.currentPictureId).text($('#txtImageName').val());
				$( "#dialogEdit" ).dialog('close');
			});
		});

		editImageRequest.fail(function( xhr, status ) 
		{
		  alert( "Error - " + status );
		});		
	},
	deleteImage : function()
	{
		var deleteImageRequest = $.ajax(
		{
			url : 'ajaxAlbum.php',
			type: "POST",
			data: { action : 'delete', albumId: albums.currentAlbum, pictureId: albums.currentPictureId }
		});

		deleteImageRequest.done(function(data)
		{
			$.getJSON( "albums.json", function( data ) 
			{
				albums.jsonAlbums = data;
				albums.displayAlbum(albums.currentAlbum);
			});			
			$( "#dialogDelete" ).dialog('close');
		});

		deleteImageRequest.fail(function( xhr, status ) 
		{
		  alert( "Error - " + status );
		});

	},
	saveNewSequence : function()
	{
		var x = ($('#albumPics').sortable('serialize'));
		var editSequenceRequest = $.ajax(
		{
			url : 'ajaxAlbum.php',
			type: "POST",
			data: 'action=reorder&albumId='+ albums.currentAlbum +  '&' + x
		});
		editSequenceRequest.done(function(data)
		{
			$.getJSON( "albums.json", function( data ) 
			{
				albums.jsonAlbums = data;
				albums.displayAlbum(albums.currentAlbum);
			});			
		});

		editSequenceRequest.fail(function( xhr, status ) 
		{
		  alert( "Error - " + status );
		});
	}
};


