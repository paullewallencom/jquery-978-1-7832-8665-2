<?php 
session_start();
if(isset($_POST['submit']))
{
	if($_POST['filledCaptchaValue'] != $_SESSION['captchaValue'])
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

$randomNumber = (string)rand(10000, 99999);
$_SESSION['captchaValue'] = $randomNumber;
?>
<html>
	<head>
        <meta charset="utf-8">
        <title>Number Captcha</title>
        <link rel="stylesheet" href="css/ui-lightness/jquery-ui-1.10.4.custom.min.css">
		<style type="text/css">
			body
			{
				font-family:arial,verdana;
				font-size:12px;
				margin: 0px auto; 
				width: 500px;
			}
			
			#frmCaptcha 
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
			
			.row {
				display: block;
				padding: 10px;
				clear: left;
			}	
			.row label 
			{
				float: left; 
				padding: 0px 10px;
				width: 125px;
				text-align: center;
			}
			
			.bgNumber 
			{
			    background: url("sprite.png") no-repeat scroll 0 0 rgba(0, 0, 0, 0);
				display: block;
				float: left;
				height: 27px;
				width: 27px;
			}
			
			#captchaTiles 
			{
				float:left;
			}
			.clear 
			{
				clear:both;
			}
		</style>
	</head>
	<body>
		<form id="frmCaptcha" method="post">
			<h3>Number CAPTCHA</h3>

			<div class="row">
				<label>CAPTCHA Number: </label>
				<?php 
					$arrayNumbers = array();
					for($i =0; $i < 5; $i++)
					{
						$pos = ($randomNumber[$i] * 26 * -1);
				?>
						<div class="bgNumber" style="background-position:0px <?php echo $pos;?>px;"></div>
				<?php 
					}
				?>
			</div>
			
			<div class="row">
				<small><strong>Rearrange the numbers given below to make the 5 digit number displayed above.</strong></small>
			</div>
			
			<div class="row">
			<?php 
				$shuffledNumber = str_shuffle($randomNumber);
			?>
				<label>Drag to reorder: </label>
				<div id="captchaTiles">
				
				<?php 
					for($i =0; $i < 5; $i++)
					{
						$pos = ($shuffledNumber[$i] * 26 * -1);
						echo '<div data-value="'.$shuffledNumber[$i].'" class="bgNumber" style="background-position:0 '.$pos.'px;"></div>';
					}
					echo '</div>';
				?>
			</div>

			<div class="row">
				<input type="hidden" name="filledCaptchaValue" id="filledCaptchaValue"/>						
				<button type="submit" name="submit">Check</button>
			</div>
		</form>
		<script src="js/jquery-1.10.2.js"></script>
		<script src="js/jquery-ui-1.10.4.custom.min.js"></script>
		<script>
			$(document).ready(function()
			{
				$('button').button();
				$('#captchaTiles').sortable(
				{
					cursor : 'pointer'
				});
				
				$('#frmCaptcha').submit(function()
				{
					/*
						var x = $('#captchaTiles').sortable('serialize');
					*/
					var str = '';
					$('#captchaTiles div.bgNumber').each(function()
					{
						str+= $(this).data('value');
					});
					$('#filledCaptchaValue').val(str);
				});
			});
		</script>
	</body>
</html>