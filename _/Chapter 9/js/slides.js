(function ($) {
    $.widget("mywidget.slideshow" , 
	{
        options: 
		{
            duration: 3000,
			effect : 'bounce',
			easingDuration : 'slow',
			beforeShow : null
		},
        _create: function () 
		{
			this.element.addClass('mywidget-banner');	
			this.element.children().addClass('mywidget-banner-item');
			$('.mywidget-banner-item').hide();
			
			this._trigger( "beforeShow", null, { element : $('.mywidget-banner-item:first')} );
			
			$('.mywidget-banner-item:first')
						.addClass('current')
						.show(this.options.effect, this.options.easingDuration);
			this._setRotation();
        },
		_setRotation : function()
		{
			var that = this;
			this.interval = setInterval(function()
			{
				that.textRotate();
			},that.options.duration);
		},
		textRotate : function()
		{
			var $that = this;
			var current = $that.element.find('.current');
			var next = current.next();
			if(next.length==0)
			{
				current.removeClass('current').hide($that.options.effect, $that.options.easingDuration, function()
				{
					$('.mywidget-banner-item:first').addClass('current').show($that.options.effect, $that.options.easingDuration);
				});
			}
			else
			{
				current.removeClass('current').hide($that.options.effect, $that.options.easingDuration, function()
				{
					$that._trigger( "beforeShow", null, { element : next} );
					next.addClass('current').show($that.options.effect, $that.options.easingDuration);
				});
					
			}
		},
        _destroy: function () 
		{
			clearInterval(this.interval);
            this.element.removeClass('mywidget-banner');
			this.element.children().removeClass('current mywidget-banner-item').show();
        },
		_setOption: function (key, value) 
		{
            switch (key) 
			{
				case "duration":
					clearInterval(this.interval);
					this.options[ key ] = value;
					this._setRotation();
					break;
				default:
					this.options[ key ] = value;
					break;
            }
            this._super("_setOption", key, value);
        }
    });

})(jQuery);