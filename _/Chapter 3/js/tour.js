$(document).ready(function()
{
	$( "#accordion" ).accordion({animate : false});
	$(document).tooltip(
	{
		items : '#contact',
		content : function()
		{
			var strContact = '<img src="http://maps.googleapis.com/maps/api/staticmap?center=New+Delhi,India&zoom=13&size=300x200&sensor=false"/>';
			strContact+= '<hr/>In case of any issues, here is the address of our new office in Central Delhi which is well connected to all the places.Feel free to visit us anytime.';
			strContact+= '<hr><span class="ui-icon ui-icon-home" style="float: left; margin-right: 5px;"></span>#23, Rachna Building, Karol Bagh -110005';
			strContact+= '<hr><span class="ui-icon ui-icon-mail-closed" style="float: left; margin-right: 5px;"></span>awesomecompany@ourlocation.com';
			return strContact;
		}
	});
	
	tour.init();
});


var tourDialog = $('#dialog').dialog(
{
	autoOpen : false,
	minWidth : 315,
	draggable : false,
	buttons: [
	{
	  id : 'buttonPrevious',	
	  text: 'Previous',
	  click: function() 
	  {
		tour.navigate('previous');
	  },
	  icons: 
	  { 
		primary: 'ui-icon-carat-1-w'
	  }
	},
	{
	  id : 'buttonNext',	
	  text: 'Next',
	  click: function(event) 
	  {
		tour.navigate('next');
	  },
	  icons: 
	  { 
		secondary: 'ui-icon-carat-1-e'
	  }
    },
	{
	  text: 'End Tour',
	  click: function() 
	  {
		tour.endTour();
	  },
	  icons: 
	  { 
		secondary: 'ui-icon-close'
	  }
	  
	}
  ],
  show : 'fold',
  hide : 'fold'
});

var steps = 
	[
		{
			element : '#logo',
			title : 'We have changed the logo !',
			content : 'Did you notice that we have made some changes to our logo as well. ',
			sequence : 1
		},
		{
			element : '#menu',
			title : 'Menu On Left',
			content : 'We have placed all the menu items on left hand side for quick access.',
			sequence : 2
		},
		{
			element : '#orders',
			title : 'Your Orders',
			content : 'Orders menu has a submenu which links to different pages.',
			sequence : 3
		},
		{
			element : '#profile',
			title : 'Your Profile',
			content : 'This link will take you to your profile page where you will be able to edit your profile and change password among other things',
			sequence : 4
		},
		{
			element : '#help',
			title : 'Get Help',
			content : 'Use this link to get help related to any issues',
			sequence : 5
		},
		{
			element : '#lastLink',
			title : 'Last Menu Link',
			content : 'This is last link of menu',
			sequence : 6
		},
		{
			element : '#section1',
			title : 'Buy Cat Posters',
			content : 'We have introduced a new category where you can buy posters of cute cats ',
			isAccordion : true,
			accordionIndex : 0,
			sequence : 7
		},
		{
			element : '#section2',
			title : 'Buy Dog Posters',
			content : 'Dog lovers also welcome.',
			isAccordion : true,
			accordionIndex : 1,
			sequence : 8
		},
		{
			element : '#section3',
			title : 'Watch videos',
			content : 'We have collected some of the best videos from web and you can see them here',
			isAccordion : true,
			accordionIndex : 2,
			sequence : 9
		},
		{
			element : '#cart',
			title : 'Your Cart',
			content : 'This is your shopping cart where all the products you have selected will be displayed.',
			sequence : 10
		},
		{
			element : '#contact',
			title : 'Contact Us',
			content : function()
			{
				var strContact = '<img src="http://maps.googleapis.com/maps/api/staticmap?center=New+Delhi,India&zoom=13&size=280x200&sensor=false"/>';
				strContact+= '<hr/>In case of any issues, here is the address of our new office in Central Delhi which is well connected to all the places.Feel free to visit us anytime.';
				strContact+= '<hr><span class="ui-icon ui-icon-home" style="float: left; margin-right: 5px;"></span>#23, Rachna Building, Karol Bagh -110005';
				strContact+= '<hr><span class="ui-icon ui-icon-mail-closed" style="float: left; margin-right: 5px;"></span>awesomecompany@ourlocation.com';
				strContact+= '<hr>You can take your mouse over Contact Us link if you want to see this information later.';
				return strContact;
			},
			sequence : 11
		},
		{
			element : '#startTour',
			title : 'Thank You!',
			content : 'Thank you for going through through the tour.',
			sequence : 12
		}
	];


var tour = 
	{
		triggerElement : '#startTour',
		tourStep : 0, 
		tourSteps : steps,
		defaultTitle : 'Welcome to the tour !',
		defaultContent: 'This tour will show you the new changes we have made to our site layout. <br> Please use next previous buttons to proceed. Click the End Tour button whenever you want to finish the tour.',
		init : function()
		{
			if(this.tourSteps == undefined || this.tourSteps.length == 0)
			{
				alert('Cannot start tour');
				return;
			}
			
			$(this.triggerElement).on('click', function(event)
			{
				tour.showStep(tour.defaultTitle, tour.defaultContent, $(this));
				return false;
			});
		},
		showStep : function(tourStepTitle, tourStepContent, whichElement)
		{
			this.prevNextButtons();
			$('body').animate(
			{
				scrollTop: $(whichElement).offset().top
			}, 500, function()
				{
					$('.ui-state-highlight').removeClass('ui-state-highlight');
						
					$(whichElement).addClass('ui-state-highlight');
					
					tourDialog.dialog('option', 'title', tourStepTitle);

					tourDialog.html(tourStepContent);

					tourDialog.dialog('option', 'position', { my: 'left top', at: 'right top', of: whichElement, collision : 'flip' });
					
					tourDialog.dialog('open');
				});
		},
		prevNextButtons : function()
		{
			$('#buttonNext').button('enable');
			$('#buttonPrevious').button('enable');
			if(this.tourStep == 0 || this.tourStep == 1)
			{
				$('#buttonPrevious').button('disable');
			}
			if(this.tourStep == this.tourSteps.length)
			{
				$('#buttonNext').button('disable');
			}
			return;
		},
		navigate : function(previousOrNext)
		{
			if(previousOrNext == 'previous')
			{
				(this.tourStep) = (this.tourStep) - 1;
			}
			else 
			{
				this.tourStep = this.tourStep + 1;
			}
			
			for(var i = 0; i<this.tourSteps.length; i++)
			{
				if(this.tourSteps[i].sequence == this.tourStep)
				{
					if(this.tourSteps[i].isAccordion)
					{
						$("#accordion" ).accordion("option", "active" , this.tourSteps[i].accordionIndex);
					}
					this.showStep(this.tourSteps[i].title, this.tourSteps[i].content, this.tourSteps[i].element);
					return;
				}
			}
		},
		endTour : function()
		{
			this.tourStep = 1;
			$('.ui-state-highlight').removeClass('ui-state-highlight');
			tourDialog.dialog( 'close' );
		}
	};



