$(document).ready(function()
{
	var dashboard = 
	{
		imageArr : [],
		init : function()
		{
			this.initPortlets();
			this.initSharing();
			this.initFlickr();
			this.setupWeather();
			this.initReddit();
			this.setupImageSelector();
		},
		initPortlets : function()
		{
			$(".column").sortable(
			{
				connectWith: ".column",
				handle: ".portlet-header",
				cancel: ".portlet-toggle",
				placeholder: "portlet-placeholder ui-corner-all"
			});

			$(".portlet")
				.addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
				.find(".portlet-header")
				.addClass("ui-widget-header ui-corner-all")
				.prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

			$( ".portlet-toggle" ).click(function() 
			{
				var icon = $( this );
				icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
				icon.closest(".portlet").find(".portlet-content").toggle('fast');
			});
			$('#loadingWeather').hide();
			$('#weatherInfo').hide();
		},
		initSharing : function()
		{
			$('.shareBox a').on('click', function()
			{
				var type = $(this).prop('type');
				dashboard.sharePage(type);
			});
		},
		sharePage : function(shareType)
		{
			var pageUrl = encodeURIComponent(document.location);
			var shareUrl;
			switch(shareType)
			{
				case 'fb':
					shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
				break;

				case 'tweet':
					shareUrl = 'https://twitter.com/intent/tweet?text=Check out my page&url='+ pageUrl +'&via=v08i';
				break;

				case 'reddit':
					shareUrl = 'http://www.reddit.com/submit?url=' + pageUrl;
				break;

				case 'gplus':
					shareUrl = 'https://plus.google.com/share?url=' + pageUrl;
				break;
				
				default :
				return false;
			}
			window.open(shareUrl , '', 'width=600,height=500');
		},
		initFlickr : function()
		{
			$.getJSON('https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?',
			{
			   tags: 'cat', 
			   format: 'json'
			},
			function(data) 
			{
				var str = '';
				var x = {data : data};
				console.log(x);
				$.each(data.items, function(i,item)
				{
					str+= '<li>';
					str+= '<a class="media" href="javascript:;" data-img="' + item.media.m + '">';
					str+= '<img src="' + item.media.m + '">';
					str+= '</a>';					
					var permaLink = '<a href="' + item.link +'" target="_blank">link</a>';
					str+= '<strong>' + item.title + '</strong>( ' + permaLink + ')<br><br>tags : ' + item.tags;
					str+= '</li>';
				});
				$('#pics').html(str);
			});

			$('#pics').on('click', 'a.media', function()
			{
				var img = $(this).data('img');
				$('#dialog').html('<img src="' + img + '">').dialog({modal : true});
			});
		},
		initReddit : function()
		{
			var apiURL = 'http://www.reddit.com/r/all.json';
			$.ajax(
			{
			  url: apiURL,
			  dataType: "jsonp",
			  jsonp: 'jsonp',
			  success: function(data)
			  {
				var x = {a : data};
				console.log(x);
				$('#reddit').html(dashboard.getRedditThreadList(data.data.children));
			  },
			  error: function (a,b,c)
			  {
				alert('Error getting data');
			  }
			});
		},
		getRedditThreadList : function(postListing)
		{
			var strHtml = '<ul>';
			for(var i = 0; i < postListing.length; i++)
			{
				var aPost = postListing[i].data;
				var permalink = 'http://reddit.com' + aPost.permalink;

				strHtml+= '<li>';
				strHtml+= (i+1) + ' - <span>[' + aPost.subreddit + ']</span> <a href="'+aPost.url+'" target="_blank">' + aPost.title + '</a> (score : ' + aPost.score + '| <a class="comments" href="' + permalink + '" target="_blank"> comments : ' + aPost.num_comments + '</a>)';
				strHtml+= '</li>';
			}
			strHtml+= '</ul>';
			return strHtml;
		},
		setupWeather : function()
		{
			var cities = ['Delhi, India', 'London,UK', 'New York,USA', 'Tokyo,Japan'];
			var strCity = '<option value="0">select a city</option>';
			$(cities).each(function(i, item)
			{
				strCity+= '<option value="' + item + '">' + item + '</option>';
			});
			$('#selCity').html(strCity);

			$('#selCity').change(function()
			{
				var selection = $(this).val();
				if(selection == 0)
				{
					return;
				}
				dashboard.displayWeather(selection);
				
			});
		},
		displayWeather : function(city)
		{
			$('#loadingWeather').show();
			$('#weatherInfo').hide();
			var apiURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city;
			$.ajax(
			{
			  url: apiURL,
			  dataType: "jsonp",
			  jsonp: 'callback',
			  success: function(weatherData)
			  {
				var x = {data : weatherData};
				console.log(x);
				$('#temp').html((weatherData.main.temp - 273.15).toFixed(2) + ' degree celcius');
				$('#tempMin').html((weatherData.main.temp_min - 273.15).toFixed(2) + ' degree celcius');
				$('#tempMax').html((weatherData.main.temp_max - 273.15).toFixed(2) + ' degree celcius');
				$('#cloudiness').html((weatherData.clouds.all) + ' % cloudy');

				var googleUrl = 'https://www.google.com/maps?q='+weatherData.coord.lat+',' + weatherData.coord.lon;
				var googleLink = ' <a href="' + googleUrl + '" target="_blank">View on Google maps</a>';

				$('#location').html(weatherData.coord.lat + ', '+ weatherData.coord.lon + googleLink);
				
				$('#weatherInfo').show();
				$('#loadingWeather').hide();
			  },
			  error: function (a,b,c)
			  {
				console.log('Error getting weather.');
			  }
			});
		},
		setupImageSelector : function()
		{
			this.imageArr = [
				{ id: 1,  name : 'Temple', path :  'images/1.jpg', thumb : 'images/thumb/1.jpg' },
				{ id: 2, name : 'Colors', path :  'images/2.jpg', thumb : 'images/thumb/2.jpg' },
				{ id: 3, name : 'Directions', path :  'images/3.jpg', thumb : 'images/thumb/3.jpg' },
				{ id: 4, name : 'Flag', path :  'images/4.jpg', thumb : 'images/thumb/4.jpg' },
				{ id: 5, name : 'A bit snow', path :  'images/5.jpg', thumb : 'images/thumb/5.jpg' }
			];
			var str = '<option value="0">select image</option>';
			$.each(dashboard.imageArr, function(i, item)
			{
				str+= '<option value="'+item.id+'">'+ item.name +'</option>'
			});
			$('#imageSelector').html(str);

			$( "#imageSelector" ).on('change', function()
			{
				dashboard.changeImage($(this));
			});

			$( "#thumbnail" ).on('click', function()
			{
				var imgPath = $(this).data('large');
				$('#dialog').html('<img src="' + imgPath + '">').dialog({modal : true, width: 'auto', top : 0});
			});
		},
		changeImage : function(selectedPic)
		{
			if(parseInt(selectedPic.val(), 10) == 0)
			{
				$('#thumbnail').empty();
				return;
			}
			$.each(dashboard.imageArr, function(i, item)
			{
				if(parseInt(selectedPic.val(), 10) === item.id)
				{
					$('#thumbnail').data('large', item.path).html('<img src="' + item.thumb +'">');
					return;
				}
			});
		}
	}
	
	dashboard.init();
});