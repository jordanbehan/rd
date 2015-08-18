var Interface = (function ($) {
    var jk = {};
    jk.config = {
	    draw : {},
    	$ui_canvas : $(".ui_canvas"),
	    $ui_nodes : $(".ui_element"),
	    $ui_hotspots : $(".ui_hotspots"),
	    $ui_frame : $(".ui_frame"),
	    $ui_pointer : $("ui_line"),
	    winW : $(window).innerWidth(),
	    winH : $(window).innerHeight(),
	    winY : 0,
		radius : $(window).outerWidth()/6
		
    };
    jk.init = function() {
		jk.config.draw = SVG("svg_nodes").size(jk.config.winW,jk.config.winH);
		
		// add frame
	    jk.config.$ui_frame = jk.config.draw.circle(jk.config.radius*2).attr("class", "ui_frame");
	    
	    // add nodes
		for (i = 0; i < 13; i++) { 
			// nodes
			var nodes = jk.config.draw.circle(20).attr("class", "ui_node").attr("data-id", i);
			// hotspots (targets)
			var hotspots = jk.config.draw.circle(10).attr("class", "ui_hotspots");
		}
		jk.config.$ui_nodes = $("#svg_nodes .ui_node");
	    jk.nodes.click();
		jk.nodes.plot();
		
		jk.config.$ui_hotspots = $("#svg_nodes .ui_hotspots");
		jk.hotspots.plot();
		
		jk.window();
    };
    jk.window = function () {
    	var $window = $(window);
    	$window.resize(function() {
    		jk.config.winH = $(window).innerHeight();
    		jk.config.winW = $(window).outerWidth();
    		jk.config.radius = $(window).outerWidth()/6;
    		jk.nodes.plot();
    	});
    };
    jk.hotspots = {
	    // test hotspots (random targets in the box)
	    plot : function () {
			var _minX = (jk.config.winW - (jk.config.radius*2))/2,
				_maxX = _minX + (jk.config.radius*2),
				_minY = jk.config.winH/2 - (jk.config.radius),
				_maxY = jk.config.winH/2 + (jk.config.radius);
			
			function randPos(min, max) {
				return Math.random() * (max - min) + min;
			};
			
			jk.config.$ui_hotspots.each(function(index) {
				var _this = this;
				_this.instance.attr({ cx : randPos(_minX, _maxX), cy : randPos(_minY, _maxY)});
			});
			
			
		}
    };
    jk.nodes = {
	    click : function () {
		    
			jk.config.$ui_nodes.on("click", this, function(){
				
				if ($(".ui_line").length > 0) {
					$(".ui_line").remove();	
					jk.config.$ui_nodes.each(function(){ this.instance.removeClass("on")}); // do I need a set yet?
				};
				
				this.instance.addClass("on");
				
				var data = $(this).data();
				
				var x1 = jk.config.$ui_hotspots[data.id].instance.attr('cx'),
					y1 = jk.config.$ui_hotspots[data.id].instance.attr('cy'),
					x2 = this.instance.attr('cx'),
					y2 = this.instance.attr('cy');
				
					jk.config.$ui_pointer = jk.config.draw.line(x1, y1, x2, y2).attr("class", "ui_line");
					var size = jk.config.$ui_pointer.width();
					//jk.config.$ui_pointer.width(10);
					//jk.config.$ui_pointer.animate().attr({"width" : size});
					console.log(size);
				}); 
		},
		plot : function () {
			var x = (jk.config.$ui_canvas.outerWidth()/2) - (jk.config.$ui_nodes.outerWidth()/2),
    			y = (jk.config.$ui_canvas.outerHeight()/2) - (jk.config.$ui_nodes.outerHeight()/2),
				alpha = Math.PI * 2 / (jk.config.$ui_nodes.length);

			jk.config.$ui_nodes.each(function(index) {
	    		var _this = this;
				var theta = alpha * index;
				var pointx  =  (Math.floor(Math.sin(theta) * jk.config.radius)) + x;
				var pointy  = -(Math.floor(Math.cos(theta) * jk.config.radius)) + y;
				var rot = Math.ceil((360/(jk.config.$ui_nodes.length)) * (index));
				_this.instance.attr({ cx : pointx, cy : pointy});

    		});
		
			jk.config.$ui_frame.radius(jk.config.radius);
			jk.config.$ui_frame.attr({ cy : (jk.config.$ui_canvas.innerHeight()/2) , cx : (jk.config.$ui_canvas.innerWidth()/2)});
    	}
    	
    };
    return jk;
})(jQuery);
/* --------------------------------------------------

	ui 
	
-------------------------------------------------- */
var App = (function ($) {
    var jk = {};
    jk.config = {
    };
    jk.vars = {
    };
    jk.init = function () {
		//jk.window();
		jk.estimator.init();
		
    };
    jk.window = function () {
    	var $window = $(window);
    	if ($("html, body").hasClass("no-touch")) {
	    
	    }
    	$window.scroll(function() {

		});
    };
  	jk.estimator = {
  		init : function () {
	  		var _this = $(".estimator"),
	  			_thisMessage = $(".estimator .msg"),
	  			_thisReveal = $(".estimator .reveal"),
	  			_thisSlider = $(".estimator .slider"),
	  			_thisBox = $(".estimator .box"),
	  			_sliderVal = _thisSlider.val();
	  			
	  			_thisReveal.css({"width" : _sliderVal + "%"});
	  			_thisBox.css({"width" : _sliderVal-5 + "%"});
	  		
	  			_thisSlider.on("mousemove", this, function(){
		  			_thisMessage.html($(this).val());	
		  			_thisReveal.css({"width" : $(this).val() + "%"});
		  			_thisBox.css({"width" : $(this).val()-5 + "%"});
	  			})
	  		
	  		
	  			_thisSlider.on("change", this, function(){
		  			_thisMessage.html($(this).val());	
		  			_thisReveal.css({"width" : $(this).val() + "%"});
		  			_thisBox.css({"width" : $(this).val()-5 + "%"});
	  			})	  		
  		}
  	};
	jk.helpers = {
		output : function (options, append) {
			var render = Mustache.to_html($(options.template).html(), options.data);
			$(options.container).html(render);
		},
		loader : function (url, func) {
			$.ajaxSetup({ async: false, cache: false });
			$.ajax ({
			    dataType : "json",
			    url: url,
			    success: function (data) { 
					func(data);
				},
			    error: function() {
				    alert("Error!");
				}
			});
		}
			
	}
    return jk;
})(jQuery);
/*
	start it up
*/
// ################################################################################
$(function () {
	
	
	
/*
	$(".typed-cta").typed({
		strings: ["123-4567", "JUNK-4-GOOD"],
		typeSpeed: 40,
		startDelay: 0,
		 loop: true,
         backDelay: 3000,
		 cursorChar: ""
	});
*/

	App.init();
	ScrollFX.init();
	
});