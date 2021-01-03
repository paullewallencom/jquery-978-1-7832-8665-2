$(document).ready(function()
{
	myMap.initialize();
});


var myMap = 
{
	map : null,
	markers : [],
	infowindow  : null,
	minPrice : 0,
	maxPrice : 0,
	hotelsList : [
		{
			name : 'Shangri La',
			lat : '28.631541',
			lng : '77.213287',
			price : 1000,
			description: 'Pellentesque accumsan molestie ipsum ut feugiat. Nunc varius nisl sed ligula vehicula, vitae sodales magna volutpat! Praesent tempus faucibus nisl, vel aliquet lectus viverra quis. Curabitur leo enim, tincidunt viverra vestibulum luctus, cursus et velit. Proin id metus ut mi sagittis varius in at nulla. Aliquam semper lobortis pellentesque. Donec aliquam risus sit amet ipsum consectetur pulvinar.',
		},
		{
			name : 'Ashu Palace',
			lat : '28.652257',
			lng : '77.19243',
			price : 1893,
			description: 'Pellentesque accumsan molestie ipsum ut feugiat. Nunc varius nisl sed ligula vehicula, vitae sodales magna volutpat! Praesent tempus faucibus nisl, vel aliquet lectus viverra quis. Curabitur leo enim, tincidunt viverra vestibulum luctus, cursus et velit. Proin id metus ut mi sagittis varius in at nulla. Aliquam semper lobortis pellentesque. Donec aliquam risus sit amet ipsum consectetur pulvinar.'
		},
		{
			name : 'Hotel Vikram',
			lat : '28.573668',
			lng : '77.245388',
			price : 2500,
			description: 'Pellentesque accumsan molestie ipsum ut feugiat. Nunc varius nisl sed ligula vehicula, vitae sodales magna volutpat! Praesent tempus faucibus nisl, vel aliquet lectus viverra quis. Curabitur leo enim, tincidunt viverra vestibulum luctus, cursus et velit. Proin id metus ut mi sagittis varius in at nulla. Aliquam semper lobortis pellentesque. Donec aliquam risus sit amet ipsum consectetur pulvinar.'
		},
		{
			name : 'Hotel Conclave Boutiq',
			lat : '28.556124',
			lng : '77.241197',
			price : 2361,
			description: 'Pellentesque accumsan molestie ipsum ut feugiat. Nunc varius nisl sed ligula vehicula, vitae sodales magna volutpat! Praesent tempus faucibus nisl, vel aliquet lectus viverra quis. Curabitur leo enim, tincidunt viverra vestibulum luctus, cursus et velit. Proin id metus ut mi sagittis varius in at nulla. Aliquam semper lobortis pellentesque. Donec aliquam risus sit amet ipsum consectetur pulvinar.'
		},
		{
			name : 'Hotel Parkland',
			lat : '28.588139',
			lng : '77.23526',
			price : 800,
			description: 'Pellentesque accumsan molestie ipsum ut feugiat. Nunc varius nisl sed ligula vehicula, vitae sodales magna volutpat! Praesent tempus faucibus nisl, vel aliquet lectus viverra quis. Curabitur leo enim, tincidunt viverra vestibulum luctus, cursus et velit. Proin id metus ut mi sagittis varius in at nulla. Aliquam semper lobortis pellentesque. Donec aliquam risus sit amet ipsum consectetur pulvinar.'
		},
	],
	initialize : function()
	{
		this.setMinMaxPrices();
		this.displayHotels();
		this.setSpinner();
		this.createMap();
		this.setMarkersAndInfoWindow();
		this.setSlider();
	},
	setMinMaxPrices : function()
	{
		this.minPrice = this.hotelsList[0].price;
		this.maxPrice = this.hotelsList[0].price;
		for(var i = 0; i< this.hotelsList.length; i++)
		{
			this.minPrice = this.hotelsList[i].price < this.minPrice ? this.hotelsList[i].price : this.minPrice;
			this.maxPrice = this.hotelsList[i].price > this.maxPrice ? this.hotelsList[i].price : this.maxPrice;
		}
		$('#currentRange').text('USD '+ this.minPrice + ' - ' + 'USD ' + this.maxPrice);
	},
	displayHotels : function()
	{
		var str = '';
		for(var i = 0; i< this.hotelsList.length; i++)
		{
			var hotel = this.hotelsList[i];
			str+= '<h3 data-price="'+ hotel.price+'">'+hotel.name+'</h3>';
			str+= '<div>';
			str+= '<div class="ui-state-highlight ui-corner-all" style="padding: 5px;">Price: USD ' + hotel.price + '</div>';
			str+= hotel.description;
			str+= '</div>';
		}
		$('#listing').html(str);
		$('#listing').accordion(
		{
			collapsible: true,
			active : false,
			heightStyle : 'content'
		});
	},
	setSpinner : function()
	{
		$('#spinner').spinner(
		{
			min : 0,
			max : 18,
			stop : function(event, ui )
			{
				myMap.map.setZoom(parseInt($(this).val(), 10));
			}
		});
	},
	createMap : function()
	{
		var mapOptions = 
		{
			center: new google.maps.LatLng(28.637926, 77.223726),
			zoom: parseInt($('#spinner').val(), 10),
			disableDefaultUI : true,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false
		};
		this.map = new google.maps.Map($("#hotelsMap")[0], mapOptions);
		this.infowindow = new google.maps.InfoWindow();
	},
	setMarkersAndInfoWindow : function()
	{
		for(var i = 0; i< this.hotelsList.length; i++)
		{
			var hotel = this.hotelsList[i];
			var marker = new google.maps.Marker({
					position: new google.maps.LatLng(hotel.lat, hotel.lng),
					map: myMap.map,
					title: hotel.name
				});
			this.markers.push(marker);
			
			google.maps.event.addListener(marker, 'click', function(marker, hotel) 
			{
				return function()
				{
					var content = $('#tabs').html();
					myMap.infowindow.setContent('<div id="hotelFeatures" style="height:280px;">'+ hotel.name+ '<hr/>' + content + '</div>');
					myMap.infowindow.open(myMap.map, marker);
					
				};
			}(marker, hotel));
		}
		
		google.maps.event.addListener(myMap.infowindow, 'domready', function(){
			$('#hotelFeatures').tabs();
		});
		
	},
	setSlider : function()
	{
		$('#slider').slider(
		{
			min: myMap.minPrice,
			max: myMap.maxPrice,
			range : true,
			values : [myMap.minPrice, myMap.maxPrice],
			step : 100,
			slide : function(event, ui)
			{
				$('#currentRange').text('USD '+ ui.values[0] + ' - ' + 'USD ' + ui.values[1]);
			},
			stop : function(event, ui)
			{
				$('#listing h3').each(function()
				{
					var price = parseInt($(this).data('price'), 10);
					//headerIndex corresponds to 0 based index of hotels in object as well as in DOM
					var headerIndex = $('#listing h3').index($(this));
					if(price >= ui.values[0] && price <=ui.values[1])
					{
						$('#listing h3:eq('+headerIndex+')').show();
						myMap.markers[headerIndex].setMap(myMap.map);
					}
					else 
					{
						$('#listing h3:eq('+headerIndex+')').hide();
						$('#listing div.ui-accordion-content:eq('+headerIndex+')').hide();
						myMap.markers[headerIndex].setMap(null);
					}
				});
			}
		});
	}
};


