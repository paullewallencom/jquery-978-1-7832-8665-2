$(document).ready(function()
{
	myReddit.init();
});

var myReddit = 
{
	apiURL : 'http://www.reddit.com',
	tabCount : 1,
	init : function()
	{
		$( "#redditTabs" ).tabs();

		$('#addNewSubreddit').button();

		$('#tabList').on('click', '.ui-icon-close', function()
		{
			var tabPanelContainer = $(this).prev('a').attr('href');
			$(this).parent('li').remove();
			$(tabPanelContainer).remove();
			$( "#redditTabs" ).tabs('refresh');
		});
	

		$('#redditTabs').on('click', '#addNewSubreddit', function()
		{
			myReddit.getJSONFromAPI('posts', $('#subredditName').val());
		});
		
		
		$('#redditTabs').on('click', '.viewText', function()
		{
			$(this).parent('div').next('div.postDescription').toggle();
		});

		$( "#dialog" ).dialog(
		{
			autoOpen: false,
			modal : true,
			title : 'Comments',
			position: { my: "center", at: "top", of: window },
			width: 800,
			height: 600
		});
		
		$('#redditTabs').on('click', '.viewComments', function()
		{
			myReddit.getJSONFromAPI('comments', $(this).data('commentsid'));
			$( "#dialog" ).dialog('open');
		});
		
		$( "#dialog" ).on( "dialogopen", function( event, ui ) 
		{
			$(this).text('Loading Comments... Please wait...');
		});

	},
	getJSONFromAPI : function(type, id)
	{
		var apiURL = this.apiURL;
		if(type == 'posts')
		{
			apiURL+= '/r/' + id + '.json';
		}
		else if(type == 'comments')
		{
			apiURL+= '/comments/' + id + '.json';
		}
		else 
		{
			alert('Error');
			return;
		}
		
		$('#errorMessage').empty();
		$('#errorContainer').hide();
		$.ajax(
		{
		  url: apiURL,
		  dataType: "jsonp",
		  jsonp: 'jsonp',
		  success: function(data)
		  {
			var x = {a : data};
			console.log(x);
			if(type == 'posts')
			{
				myReddit.createTab(id, data);
			}
			else if(type == 'comments')
			{
				myReddit.displayComments(data);
			}
			
		  },
		  error: function (xhr,statusString, errorString)
		  {
			$('#errorMessage').html('An error occured and content could not be loaded.');
			$('#errorContainer').show();
		  }
		});
	},
	createTab : function(subredditName, postList)
	{
		if(postList.data == null || postList.data.children == null)
		{
			$('#errorMessage').html('Oops some thing is wrong');
			$('#errorContainer').show();
			return;
		}
		
		var tabContent = myReddit.getPostListingHtml(postList.data.children);
		
		(myReddit.tabCount)++;
		$('#tabList').append('<li><a href="#tabs-'+(myReddit.tabCount)+'">' + subredditName + '</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>');
		$( "#redditTabs" ).append('<div id="tabs-'+(myReddit.tabCount)+'">' + tabContent + '</div>');

		$( "#redditTabs" ).tabs('refresh');

		var lastTabIndex = $('#tabList li').length - 1;
		$( "#redditTabs" ).tabs('option', 'active', lastTabIndex);
	},
	getPostListingHtml : function(postListing)
	{
		var strHtml = '<ul class="postList">';
		for(var i = 0; i < postListing.length; i++)
		{
			var aPost = postListing[i].data;
			strHtml+= '<li>';
			if(aPost.is_self)
			{
				strHtml+= '<div class="postTitle">' + aPost.title + '</div>';
			}
			else 
			{
				strHtml+= '<div class="postTitle"><a href="'+aPost.url+'" target="_blank">' + aPost.title + '</a></div>';
			}
			strHtml+= '<div class="extras">';
			if(aPost.is_self && aPost.selftext_html != null)
			{
				strHtml+= '<a class="viewText"><span class="ui-icon ui-icon-plusthick"></span> View Text</a>';
			}
			if(parseInt(aPost.num_comments, 10) > 0)
			{
				strHtml+= '<a class="viewComments" data-commentsid=' + aPost.id + '>View ' + aPost.num_comments + ' Comments</a>';
			}
			else 
			{
				strHtml+= '<a>No comments so far.</a>';
			}
			strHtml+= '</div>';
			if(aPost.is_self && aPost.selftext_html != null)
			{
				strHtml+= '<div class="postDescription">' + this.htmlDecode(aPost.selftext_html) + '</div>';
			}
			strHtml+= '</li>';
		}
		strHtml+= '</ul>';
		return strHtml;
	},
	displayComments : function(data)
	{
		if(data != undefined && data.length > 0)
		{
			var permalink = this.apiURL + data[0].data.children[0].data.permalink;
			var linkToReddit = '<a href="'+permalink+'" target="_blank">View all the comments on reddit</a>';
			var commentsHTML = this.getCommentsHTML(data[1].data.children);
			$('#dialog').html(linkToReddit + commentsHTML);
		}
	},
	getCommentsHTML : function(commentsList)
	{
		var str  = '<ul class="comments">';
		for(var i = 0; i< commentsList.length; i++)
		{
			var x = commentsList[i];
			str+= '<li class="comment"> <a class="username">' + x.data.author + '('+x.data.ups+'|'+x.data.downs+')</a> ' + this.htmlDecode(x.data.body_html);
			if(x.data.replies != undefined && x.data.replies != "")
			{
				str+= this.getCommentsHTML(x.data.replies.data.children);
			}
			str+= '</li>';
		}
		str+= '</ul>';
		return str;
	},
	htmlDecode : function(input)
	{
		return $('<div/>').html(input).text();
	}
};
