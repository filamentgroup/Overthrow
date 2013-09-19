
(function(w, overthrow) {
	var lib = overthrow.sidescroller;
	function sendEvent( elem, evt, args, ieID ){
		// TODO needs IE8 support
		if( document.createEvent ){
			var event = document.createEvent( "Event" );
			event.initEvent( evt, true, true );
			event.overthrow = args;
			elem.dispatchEvent( event );
		}
		else {
			w.document.documentElement[ieID][ evt ] = {
				e: evt,
				overthrow: args
			};
			w.document.documentElement[ evt ]++;
		}
	}

	function goTo( event ) {
		var options = event.overthrow || {}, goto, scroller, ul, thisScroll;

		if( options.name !== "goTo" ){
			return;
		}

		goto = options.arguments[0];
		scroller = event.target || event.srcElement;
		thisScroll = scroller.querySelector( ".overthrow" );
		ul = scroller.querySelector( "ul" );

		console.log( scroller );
		var slides = ul.querySelectorAll( "li" ),
			slidesWidth = scroller.offsetWidth,
			slideWidth = slides[ 0 ].offsetWidth,
			newSlide = parseInt( goto, 10),
			newScroll = slideWidth * newSlide;

			var newActive = scroller.getActiveSlides( newScroll );

			overthrow.toss( thisScroll, {
				left: newScroll,
				easing: options.easing
			});

	}

	lib.onEvent( "overthrow-init", w.document.documentElement, function( event ) {
		var scroller = event.overthrow.sideScroll,
			options = event.overthrow.options || {};

		lib.onEvent( "overthrow-method", scroller, goTo);
	});
})( this, this.overthrow );
