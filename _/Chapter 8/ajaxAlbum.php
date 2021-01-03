<?php 
	$albumId = $_POST['albumId'];
	$pictureId = $_POST['pictureId'];

	$jsonAlbums = file_get_contents('albums.json');
	$jsonAlbums = json_decode($jsonAlbums);	
	switch($_POST['action'])
	{
		case 'edit':
			foreach($jsonAlbums as $album)
			{
				if($album->id == $albumId)
				{
					foreach($album->pictures as $picture)
					{
						if($picture->id == $pictureId)
						{
							$picture->imageTitle = $_POST['newImageName'];
							
							file_put_contents('albums.json', json_encode($jsonAlbums));
							
							break;
						}
					}
					break;
				}
			}
		break;
		case 'delete':
			foreach($jsonAlbums as $album)
			{
				if($album->id == $albumId)
				{
					foreach($album->pictures as $index => $picture)
					{
						if($picture->id == $pictureId)
						{
							unset($album->pictures[$index]);
							$remaining = array_values($album->pictures);
							$album->pictures = $remaining;
							file_put_contents('albums.json', json_encode($jsonAlbums));
							break;
						}
					}
					break;
				}
			}
		break;
		case 'reorder':
			$pictureIds = $_POST['picture'];
			foreach($jsonAlbums as $album)
			{
				if($album->id == $albumId)
				{
					$sequenceStart = 1;
					foreach($pictureIds as $id)
					{
						/* find this id in in album pictures and set sequence*/
						foreach($album->pictures as $picture)
						{
							if($picture->id == $id)
							{
								$picture->sequence = $sequenceStart;
								$sequenceStart++;
								break;
							}
						}
					}
					file_put_contents('albums.json', json_encode($jsonAlbums));
					break;
				}
			}
		break;
	}
?>