/* --------------------------------------------------

	framerate shim
		
-------------------------------------------------- */
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* --------------------------------------------------

	scrollin parallax fx
	
-------------------------------------------------- */
var ScrollFX = (function ($) {
    var jk = {};
    jk.config = {
    	factor: 0.6,
    	bg: 0,
    	scrolling: false,
    	backgrounds: ".no-touch .para",
    	winY: 0,
    	winY_offset: 0,
    	winH: $(window).outerHeight(),
    	winW: $(window).outerWidth()
    };
    
    jk.init = function () {
		jk.parallax.init();
    	jk.window();
    };
    jk.window = function () {
    	var $window = $(window);
    	$window.resize(function() {
    		jk.config.winH = $(window).innerHeight();
    		jk.config.winW = $(window).outerWidth();
    	});
    	
    	$window.scroll(function() {
    		jk.config.winY = $(this).scrollTop() + jk.config.winY_offset;
    		
    		$("html, body").addClass("disable-hover");
    	
    		jk.config.scrolling = true;
		});
    };
    jk.parallax = {
    	config : {
    		lastScrollY : 0
    	},    	
    	init : function () {
    		jk.parallax.loop();
    	},
    	animate: function () {
        	$(jk.config.backgrounds).each(function(index) {
        		var fg = $(this).find(".fx"),
					bg = $(this).find(".para-container"),
					y = Math.floor((($(this).offset().top - jk.config.winY) * jk.config.factor + (index+1))),
					top = $(this).offset().top,
					height = $(this).outerHeight();	

				// Check if totally above or totally below viewport
				if (top + height < jk.config.winY || top > jk.config.winY + jk.config.winH) {
					y = 0;
					return;
				}
				if ($(bg).length) {
					$(bg).each(function(index) {
						var dir = $(this).data();
						if (dir.para == "horz") {			
							var str = "translate3d(" + (-y/dir.speed) + "px, 0, 0)";
							
						} else {
							var str = "translate3d(0, " + (-y/dir.speed) + "px, 0)";
						
						}	
						$(this).css({"-webkit-transform": str});
						$(this).css({"-moz-transform": str});
						$(this).css({"-ms-transform": str});
						$(this).css({"transform": str});
					});

				}
				if ($(fg).length && !$(this).hasClass("on")) {
					
					yy = y * - 0.5;
					
					var o = 1 - (Math.abs(y / $(this).innerHeight())*2),
						oo = o / 1;
					
/*
					$(bg).css({"-ms-filter" : "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + oo +")"});
					$(bg).css({" filter" : "alpha(opacity=" + oo + ")"});
					$(bg).css({"-moz-opacity" : oo});
					$(bg).css({" -khtml-opacity" : oo});
					$(bg).css({"opacity" : oo});
					
					$(fg).css({"-ms-filter" : "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + o +")"});
					$(fg).css({" filter" : "alpha(opacity=" + o + ")"});
					$(fg).css({"-moz-opacity" : o});
					$(fg).css({"  -khtml-opacity" : o});
					$(fg).css({"opacity" : o});
  
    				$(fg).css({"-webkit-transform": "translate3d(0," + yy + "px, 0)"});
					$(fg).css({"-moz-transform": "translate3d(0," + yy + "px, 0)"});
					$(fg).css({"-ms-transform": "translate3d(0," + yy + "px, 0)"});
					$(fg).css({"transform": "translate3d(0," + yy + "px, 0)"});
*/
				}
			});
        },
    	loop : function () {
    		
    	    if (jk.config.scrolling) {  
    	    	jk.parallax.animate();
        		jk.config.scrolling = false;
        		$("html, body").removeClass("disable-hover");
        	}
        	requestAnimationFrame(jk.parallax.loop);
        	
    	}
    };
    return jk;
})(jQuery);