var colorPicker = 
{
	init : function () 
	{
		var t = this;
		$( ".slider" ).slider(
		{
			range: "min",
			max: 255,
			slide : function (event, ui) 
			{
				t.setColor($(this), ui.value);
			},
			change : function (event, ui) 
			{
				t.setColor($(this), ui.value);
			}
		});

		$('input').spinner(
		{
			min :0,
			max : 255,
			spin : function (event, ui) 
			{
				var sliderRef = $(this).data('slider');
				$('#' + sliderRef).slider("value", ui.value);
			}
		});
	   

		$( "#txtRed, #txtGreen, #txtBlue" ).slider('value', 0);
		$( "#bgRed, #bgGreen, #bgBlue" ).slider('value', 255);
	},
	setColor : function(slider, value) 
	{
		var t = this;
		var spinnerRef = slider.data('spinner');
		$('#' + spinnerRef).spinner("value", value);

		var sliderType = slider.data('type')

		var hexColor = t.getHexColor(sliderType);
		if(sliderType == 'text')
		{
		  	$('#textBlock').css({'color' : hexColor});
		  	$('.left span:last').text(hexColor);			      		
		}
		else 
		{
		  	$('#textBlock').css({'background-color' : hexColor});
		  	$('.right span:last').text(hexColor);			      		
		}
	},
	getHexColor : function(sliderType)
	{
		var t = this;
		var allInputs;
		var hexCode = '#';
		if(sliderType == 'text')
		{
			//text color
			allInputs = $('.left').find('input[type=text]');
		}
		else 
		{
			//background color
			allInputs = $('.right').find('input[type=text]');
		}
		allInputs.each(function (index, element) {
			hexCode+= t.convertToHex($(element).val());
		});

		return hexCode;
	},
	convertToHex : function (val) 
	{
		var x  = parseInt(val, 10).toString(16);
		return x.length == 1 ? "0" + x : x;
	}
}

$(function() {
	colorPicker.init();
});
