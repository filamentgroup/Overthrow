(function(w) {
	// NOTE not a general purpose add class, whitespace accounting done externally
	function addClass( element, classStr ) {
		element.setAttribute( "class", element.getAttribute( "class" ).replace( classStr, "" ));
		element.setAttribute( "class", element.getAttribute( "class" ) + classStr );
	}

	// NOTE not a general purpose remove class, whitespace accounting done externally
	function removeClass( element, classStr ) {
		element.setAttribute( "class", element.getAttribute( "class" ).replace( classStr, "" ));
	}

	function toggleNavigation( event ) {
		if( rewind ) {
			return;
		}

		var disablePrev = false, disableNext = false,
				active, slides, slidesWidth, currScroll, scrollWidth,
				target, nextAnchor, prevAnchor, thisScroll, disabledClassStr = " disabled";

		event = event || w.event;
		target = event.target || event.srcElement;

		nextAnchor = target.querySelector( "a.sidescroll-next" );
		prevAnchor = target.querySelector( "a.sidescroll-prev" );
		thisScroll = target.querySelector( ".overthrow" );

		// if this comes from a click or a snap use the active pages
		// calculation provided as an event property, otherwise use
		// the scroll calculation
		// NOTE the assignment is deliberate
		if( active = (event && event.overthrow.active) ) {
			slides = thisScroll.querySelectorAll( "li" );

			debugger;
			disablePrev = (active[0] == 0);
			disableNext = (active[active.length - 1] >= slides.length - 1);
		} else {
			slidesWidth = thisScroll.offsetWidth,
			currScroll = thisScroll.scrollLeft,
			scrollWidth = thisScroll.scrollWidth - slidesWidth;

			debugger;
			disablePrev = currScroll < 5;
			disableNext = currScroll > scrollWidth - 5;
		}

		removeClass( nextAnchor, disabledClassStr );
		removeClass( prevAnchor, disabledClassStr );

		if( disablePrev ) {
			addClass( prevAnchor, disabledClassStr );
		}

		if( disableNext ) {
			addClass( nextAnchor, disabledClassStr );
		}
	}

	var rewind;

	if( w.document.addEventListener ){
		w.document.addEventListener( "overthrow-init", function( event ) {
			var thisSideScroll = event.overthrow.sideScroll,
				options = event.overthrow.options || {};

			rewind = options.rewind;

			thisSideScroll.addEventListener( "overthrow-scroll", toggleNavigation, false );
			thisSideScroll.addEventListener( "overthrow-next", toggleNavigation, false );
			thisSideScroll.addEventListener( "overthrow-prev", toggleNavigation, false );
		}, false);
	} else if( w.document.attachEvent ){
		w.document.attachEvent( "overthrow-init", function( event ) {
			var thisSideScroll = event.overthrow.sideScroll,
				options = event.overthrow.options || {};

			rewind = options.rewind;

			thisSideScroll.attachEvent( "overthrow-scroll", toggleNavigation, false );
			thisSideScroll.attachEvent( "overthrow-next", toggleNavigation, false );
			thisSideScroll.attachEvent( "overthrow-prev", toggleNavigation, false );
		}, false);
	}
})(window);
