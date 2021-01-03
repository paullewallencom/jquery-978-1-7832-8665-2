(function ($) {
    $.widget("mywidget.searchable" , 
	{
        options: 
		{
            characterLength: 3,
			searchLabel : 'Enter characters : '
        },
        _create: function () 
		{
			if(!this.element.is('table'))
			{
				console.error('not a table element');
				return;
			}
			
			this.element.addClass('mywidget-searchable-table');
			
			var colspan = (this.element).find('tr:first').children().length;
			
			this.searchInput =  $("<input type='text' class='mywidget-textbox ui-state-highlight ui-corner-all'>")
								.insertBefore((this.element)
								.find('tr:first'))
								.wrap('<tr class="mywidget-searchBoxContainer"><td colspan="'+colspan+'"></td></tr>');
								
			$("<label class='mywidget-label-search'>"+ this.options.searchLabel+"</label>").insertBefore(this.searchInput);
			
			this._on(this.searchInput, 
			{
				keyup: "_filterTable",
			});
        },
        _destroy: function () 
		{
            this.element.removeClass('mywidget-searchable-table');
			$('.mywidget-searchBoxContainer').remove();
        },
        _setOption: function (key, value) 
		{
            switch (key) 
			{
				case "searchLabel":
					this.searchInput.prev('label').text(value);
					break;
				default:
					this.options[ key ] = value;
					break;
            }
            this._super("_setOption", key, value);
        },
        _filterTable: function (event) 
		{
			var inputVal = $.trim(this.searchInput.val());
			if(inputVal.length < this.options.characterLength)
			{
				this.element.find('tr').show();
				return;
			}
			this.element.find('tr:gt(0)').each(function(index,row)
			{
				var found=false;
				$(row).find('td,th').each(function(index,td)
				{
					var regExp=new RegExp(inputVal,'i');
					if(regExp.test($(td).text()))
					{
						found = true;
					}
				});
				if(found)
				{
					$(row).show();
				}
				else 
				{
					$(row).hide();
				}				
			});
        }
    });

})(jQuery);