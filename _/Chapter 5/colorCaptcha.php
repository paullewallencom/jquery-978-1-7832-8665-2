<?php
session_start();
if(isset($_POST['submit']))
{
	if($_POST['selectedColor'] != $_SESSION['randomColor'])
	{
?>
		<div class="row ui-widget" style="line-height: 20px;">
			<div class="ui-state-error ui-corner-all">
				<p>
					<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>
					CAPTCHA Failed. Try again.
				</p>
			</div>
		</div>							

<?php 
	}
	else 
	{
?>
		<div class="row ui-widget" style="line-height: 20px;">
			<div class="ui-state-highlight ui-corner-all">
				<p>
					<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>
					CAPTCHA Passed. 
				</p>
			</div>
		</div>							

<?php 
	}
}

$arrColors = array('red', 'green', 'blue', 'white', 'black');
$randomKey = array_rand($arrColors);
$randomColor = $arrColors[$randomKey];
$_SESSION['randomColor'] = $randomColor;

?>
<html>
	<head>
        <meta charset="utf-8">
        <title>Color Captcha</title>
        <link rel="stylesheet" href="css/ui-lightness/jquery-ui-1.10.4.custom.min.css">
		<style type="text/css">
			body
			{
				font-family:arial,verdana; 
				font-size:12px; 
				margin: 0px auto; 
				width: 700px;
			}
			#frmCaptcha 
			{
				border: 1px solid #aaa;
				float: left;
				margin: 0 auto; 
				padding: 20px; 
				width: 100%;
			}
			h3
			{
				border-bottom:1px solid #aaa;
			}
			.row 
			{
				display: block;
				padding: 20px 10px; 
				clear:left; 
				float:left;
			}	
			.colors
			{
				float: left; 
				border: 1px solid #aaa; 
				padding: 20px 10px;
			}
			.colorTile 
			{
				border:1px solid #000;
				margin:0 5px;
				display: block;
				float: left;
				height: 40px;
				width: 40px;
				z-index:1;
			}
			
			.row label 
			{
				float: left;
				padding: 0px 10px;
				width: 25px; 
				text-align: center;
			}
			
			.dropbox
			{
				border: 1px solid #aaa;
				float: left; 
				height: 82px; 
				width: 100px;
				z-index: 0;
			}

			.clear 
			{
				clear:both;
			}
		</style>
	</head>
	<body>
		<form id="frmCaptcha" method="post">
				<h3>Color CAPTCHA</h3>

				<div class="row">
					<div class="colors">
					<?php 
						foreach($arrColors as $color)
						{
					?>
							<div class="colorTile" style="background-color:<?php echo $color;?>;" data-key="<?php echo $color;?>"></div>
					<?php 
						}
					?>
					</div>
				</div>
				
				<div class="row">
					<div class="dropbox">Drop Here</div>
				</div>
				</div>
				
				<div class="row">
					<strong>Solve the CAPTCHA by dragging the <strong><u><?php echo strtoupper($randomColor);?></u></strong> colored box in the box above.</strong>
				</div>
				<div class="row">
					<input type="hidden" name="selectedColor" id="selectedColor"/>
					<button type="submit" name="submit">Check</button>
				</div>
		</form>

		<script src="js/jquery-1.10.2.js"></script>
		<script src="js/jquery-ui-1.10.4.custom.min.js"></script>
		<script>
			$(document).ready(function()
			{
				$('button').button();

				$('.colorTile').draggable(
				{
					revert : 'invalid',
					helper: 'clone',
					cursor: 'move'
				});
				
				$('.dropbox').droppable(
				{
				  accept: function(item)
				  {
					if(item.hasClass('colorTile') && !$('.dropbox .colorTile').length)
					{
						return true;
					}
					return false;
				  },
				  activeClass: 'ui-state-highlight',
				  drop: function( event, ui ) 
				  {
					var $item = (ui.draggable);
					$item.css({'left' : '0', 'top' : 0}).appendTo('.dropbox');
				  }
				});
				
				$('.colors').droppable(
				{
					accept: '.colorTile',
					drop: function( event, ui ) 
					{
						var $item = (ui.draggable);
						$item.css({'left' : '0', 'top' : 0}).appendTo('.colors');
					}
				});

				$('#frmCaptcha').submit(function()
				{
					var x = $('.dropbox .colorTile').data('key');
					$('#selectedColor').val(x);
				});
			});
		</script>
	</body>
</html>