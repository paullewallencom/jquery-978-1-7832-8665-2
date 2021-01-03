$(function()
{
	objTimeline.init();
});
var objTimeline = 
{
	minYear : 0,
	maxYear : 0,
	currentYear : 0,
	itemsToDisplay : 5,
	maxScrollYear : 0,
	timelineWindowStartYear : 0,
	windowLeft:0,
	isWindowOpen : false,
	timelineData : 
	[
		{
			year : 2001,
			events : ['Human Genome Sequence Revealed', 'World Economic Slowdown']
		},
		{
			year : 2002,
			events : []
		},
		{
			year : 2003,
			events : ['Space shuttle Columbia crashed', 'India and Pakistan reach cease-fire in Kashmir', 'Earthquake in Iran kills over 15,000 people']
		},
		{
			year : 2004,
			events : ['NASA rover Opportunity lands on Mars', 'Yasar Arafat dies', 'Bird flu spreads in many countries']
		},
		{
			year : 2005,
			events : ['Hurricane Katrina on August 29']
		},
		{
			year : 2006,
			events : ['Google buys YouTube for more than $1.5 billion', 'Apple iTunes sold 1 billionth song', 'Saddam Hussein executed', ' Italy won FIFA World Cup 5-3 vs. France']
		},
		{
			year : 2007,
			events : [' Halo 3 released', 'Microsoft released Windows Vista']
		},
		{
			year : 2008,
			events : ['Barack Obama became first African-American president of USA', 'Summer olympic games held in Beijing']
		},
		{
			year : 2009,
			events : ['Israel attacks Gaza', 'Michael Jackson dies at 50 years']
		},
		{
			year : 2010,
			events : ['Apple released first iPad', 'Earthquake in Haiti']
		}
	],
	init : function()
	{
		this.createMarkup();
		this.createTimeline();
	},
	createMarkup : function()
	{
		$('.container').css({width: (objTimeline.itemsToDisplay*100)+'px'});
		$('#rightOverlay').css({ width: ((objTimeline.itemsToDisplay * 100) - 100) + 'px' });
		this.minYear = this.timelineData[0].year;
		this.maxYear = this.timelineData[0].year;
		var strYearDivs = '';
		for(var i=0; i< this.timelineData.length; i++)
		{
			strYearDivs+= '<div class="year">';
			strYearDivs+= '<strong>'+ this.timelineData[i].year + '</strong>';
			strYearDivs+= '<div class="numEvents">' + (this.timelineData[i].events.length) + ' events found</div>';
			strYearDivs+= '</div>';
			this.minYear = this.timelineData[i].year < this.minYear ? this.timelineData[i].year : this.minYear;
			this.maxYear = this.timelineData[i].year > this.maxYear ? this.timelineData[i].year : this.maxYear;
		}
		this.currentYear = this.minYear;
		this.timelineWindowStartYear = this.currentYear;
		$('#sliderVal').text(this.currentYear);
		this.maxScrollYear = this.maxYear - (objTimeline.itemsToDisplay - 1);
		$('#timeline').html(strYearDivs);
	},
	createTimeline: function()
	{
		$('#slider').slider(
		{
			min: objTimeline.minYear,
			max: objTimeline.maxYear,
			step : 1,
			start : function(event, ui)
			{
				if(objTimeline.isWindowOpen)
				{
					objTimeline.closeWindow();
				}
			},
			slide: function(event, ui)
			{
				objTimeline.currentYear = ui.value;
				$('#sliderVal').text(objTimeline.currentYear);
			},
			stop : function(event, ui)
			{
					//animate timeline, window and overlays
				if(objTimeline.currentYear >= objTimeline.maxScrollYear)
				{
					objTimeline.timelineWindowStartYear = objTimeline.maxScrollYear;
					$('#timeline').animate(
					{
						left : (objTimeline.timelineData.length - objTimeline.itemsToDisplay) * 100 * -1
					}, 400);

					var yearsToScroll = objTimeline.currentYear - objTimeline.maxScrollYear;
					
					$('#window').animate(
					{
						left :yearsToScroll * 100
					}, 400);
					$('#leftOverlay').show().animate(
					{
						width: (yearsToScroll * 100)
					}, 400);
					$('#rightOverlay').show().animate(
					{
						width: ((objTimeline.itemsToDisplay -1) * 100 ) - (yearsToScroll * 100 )
					}, 400);
				}
				else 
				{
					objTimeline.timelineWindowStartYear = objTimeline.currentYear;
					var yearDiff = Math.abs(objTimeline.currentYear - objTimeline.minYear);
					var newLeft = ((yearDiff * 100)) * -1;
					$('#timeline').animate(
					{
						left : newLeft
					}, 400);					
					
					$('#window').animate(
					{
						left : 0
					}, 400);
					
					$('#leftOverlay').hide();
					
					$('#rightOverlay').show().animate(
					{
						width: (objTimeline.itemsToDisplay * 100 ) - 100
					}, 400);
				}
			}
		});
		
		
		$('#window').draggable(
		{
			containment: '.container', 
			grid : [100,0],
			cursor: 'pointer',
			drag : function(event, ui)
			{
				var leftPos = ui.position.left;
				$('#leftOverlay').css({width: leftPos}).show();
				$('#rightOverlay').css({width : (objTimeline.itemsToDisplay * 100) - leftPos - 100}).show();
			},
			stop : function(event, ui)
			{
				var leftPos = ui.position.left;
				leftPos = leftPos/100;
				objTimeline.currentYear = objTimeline.timelineWindowStartYear + leftPos;
				$('#slider').slider('value', objTimeline.currentYear);
				$('#sliderVal').text(objTimeline.currentYear);
			}
		});
		$('#window').click(function()
		{
			if(objTimeline.isWindowOpen)
			{
				return;
			}
			objTimeline.isWindowOpen = true;
			$('.link').hide();
			objTimeline.windowLeft = $(this).css('left');
			$(this).css({'background-color' : '#fff'})
			.animate(
			{
				left : 0,
				width : (objTimeline.itemsToDisplay * 100 ) -4 + 'px',
				height: '246px'
			}, 100, function()
			{
				$('.container').css({'border' : 0});
				$('.close').show();
				var str = '<ul>';
				for(var i=0; i <objTimeline.timelineData.length; i++)
				{
					if(objTimeline.timelineData[i].year == objTimeline.currentYear)
					{
						var allEvents = (objTimeline.timelineData[i]).events;
						if(allEvents.length == 0 )
						{
							str+= '<li>No events found.</li>';
						}
						for(var j=0; j< allEvents.length; j++)
						{
							str+= '<li>';
							str+= allEvents[j];
							str+= '</li>';
						}
						break;
					}
				}
				str+= '</ul>';
				$('#yearEvents').html(str);
			});
		});
		
		$('.close').click(function(event)
		{
			//event.stopPropagation();
			objTimeline.closeWindow();
		});
	},
	closeWindow : function()
	{
		$('.container').css({'border' : '1px solid #333', 'border-left' : 0});	
		$('#yearEvents').empty();
		$('.close').hide();
		$('.link').show();
		$('#window').animate(
		{
			width: '99px', 
			left : objTimeline.windowLeft
		}, 500, function()
		{
			$(this).css({'background-color' : 'transparent'});
			objTimeline.isWindowOpen = false;
		});
	}
};