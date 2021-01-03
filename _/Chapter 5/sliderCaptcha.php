<?php 
session_start();
if(isset($_POST['submit']))
{
	if($_POST['minValSelected'] != $_SESSION['sliderMin'] || $_POST['maxValSelected'] != $_SESSION['sliderMax'] )
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

$randomNumber1 = (string)rand(0, 49);
$randomNumber2 = (string)rand(50, 100);
$_SESSION['sliderMin'] = $randomNumber1;
$_SESSION['sliderMax'] = $randomNumber2;
?>
<html>
	<head>
        <meta charset="utf-8">
        <title>Slider Captcha</title>
        <link rel="stylesheet" href="css/ui-lightness/jquery-ui-1.10.4.custom.min.css">
		<style type="text/css">
			body
			{
				font-family:arial,verdana; 
				font-size:12px;
				margin: 0px auto; 
				width: 500px;
			}
			.frmCaptcha 
			{
				border: 1px solid #EEEEEE;
				float: left;
				margin: 0 auto;
				padding: 20px;
				width: 100%;
			}
			h3
			{
				border-bottom:1px solid #eee;
			}
			.row 
			{
				display: block;
				padding: 20px 10px;
			}	
			.row label 
			{
				float: left; padding: 0px 10px; width: 25px; text-align: center;
			}
			
			#slider 
			{
				width:300px;float:left;
			}
			.clear 
			{
				clear:both;
			}
		</style>
	</head>
	<body>
		<form class="frmCaptcha" method="post">
				<h3>Slider CAPTCHA
				<br>
					<small>Set the minimum and maximum values of slider to <?php echo $randomNumber1;?> and <?php echo $randomNumber2;?> respectively.</small>
				</h3>

				<div class="row">
					<label class="minVal">0</label>
					<div id="slider"></div>
					<label class="maxVal">100</label>
				</div>

				<div class="row">
					<input type="hidden" name="minValSelected" id="minValSelected"/>
					<input type="hidden" name="maxValSelected" id="maxValSelected"/>						
					<button type="submit" name="submit">Check</button>
				</div>
		</form>

		<script src="js/jquery-1.10.2.js"></script>
		<script src="js/jquery-ui-1.10.4.custom.min.js"></script>
		<script>
			$(document).ready(function()
			{
				$('button').button();
				$('#slider').slider(
				{
					values : [0, 100],
					min : 0,
					max : 100,
					slide: function(event, ui) 
					{
						$('.minVal').text(ui.values[0]);
						$('.maxVal').text(ui.values[1]);
						
						$('#minValSelected').val(ui.values[0]);
						$('#maxValSelected').val(ui.values[1]);
					}
				});
			});
		</script>
	</body>
</html>