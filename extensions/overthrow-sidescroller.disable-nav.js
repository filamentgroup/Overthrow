(function(w, overthrow) {
	var rewind, disabledClassStr = " disabled", lib = overthrow.sidescroller;

	// NOTE not a general purpose add class, whitespace accounting done externally
	function addClass( element, classStr ) {
		element.setAttribute( "class", element.getAttribute( "class" ).replace( classStr, "" ));
		element.setAttribute( "class", element.getAttribute( "class" ) + classStr );
	}

	// NOTE not a general purpose remove class, whitespace accounting done externally
	function removeClass( element, classStr ) {
		element.setAttribute( "class", element.getAttribute( "class" ).replace( classStr, "" ));
	}

	function toggleNavigationEvent( event ) {
		event = event || w.event;

		// if this comes from a click or a snap use the active pages
		// calculation provided as an event property, otherwise use
		// the scroll calculation
		toggleNavigation( event.target || event.srcElement, event && event.overthrow && event.overthrow.active );
	}

	function toggleNavigation( target, active, useActiveSlide ) {
		if( rewind ) {
			return;
		}

		var disablePrev = false, disableNext = false,
				slides, slidesWidth, currScroll, scrollWidth, activeSlide,
				nextAnchor, prevAnchor, thisScroll, rwdAnchor, ffAnchor;


		nextAnchor = target.querySelector( "a.sidescroll-next" );
		prevAnchor = target.querySelector( "a.sidescroll-prev" );
		rwdAnchor = target.querySelector( "a.sidescroll-rwd" );
		ffAnchor = target.querySelector( "a.sidescroll-ff" );
		activeSlide = target.querySelector( "li.active" );
		thisScroll = target.querySelector( ".overthrow" );

		if( active ) {
			slides = thisScroll.querySelectorAll( "li" );

			disablePrev = (active[0] == 0);
			disableNext = (active[active.length - 1] >= slides.length - 1);
		} else {
			slidesWidth = thisScroll.offsetWidth,
			currScroll = thisScroll.scrollLeft,
			scrollWidth = thisScroll.scrollWidth - slidesWidth;

			if( useActiveSlide && activeSlide ) {
				disablePrev = !activeSlide.previousElementSibling;
			} else {
				disablePrev = currScroll < 5;
			}
			disableNext = currScroll > scrollWidth - 5;
		}

		removeClass( nextAnchor, disabledClassStr );
		removeClass( prevAnchor, disabledClassStr );

		if( ffAnchor ) {
			removeClass( ffAnchor, disabledClassStr );
		}

		if( rwdAnchor ) {
			removeClass( rwdAnchor, disabledClassStr );
		}

		if( disablePrev ) {
			addClass( prevAnchor, disabledClassStr );

			if( rwdAnchor ) {
				addClass( rwdAnchor, disabledClassStr );
			}
		}

		if( disableNext ) {
			addClass( nextAnchor, disabledClassStr );

			if( ffAnchor ) {
				addClass( ffAnchor, disabledClassStr );
			}
		}
	}

	lib.onEvent( "overthrow-init", w.document.documentElement, function( event ) {
		var thisSideScroll = event.overthrow.sideScroll,
			options = event.overthrow.options || {}, rewind, rwdButton;

		if( options.disableNav === true ) {
			// alert the toggle nav function that it should be disabled on rewind
			rewind = options.rewind;

			lib.onEvent( "overthrow-scroll", thisSideScroll, toggleNavigationEvent);
			lib.onEvent( "overthrow-next", thisSideScroll, toggleNavigationEvent);
			lib.onEvent( "overthrow-prev", thisSideScroll, toggleNavigationEvent);
			lib.onEvent( "overthrow-refresh", thisSideScroll, toggleNavigationEvent);
			lib.onEvent( "overthrow-resize", thisSideScroll, toggleNavigationEvent);

			// toggle on init to account for a small number of initial elements
			// in fixed width scrollers
			toggleNavigationEvent({ target: thisSideScroll });

			addClass(thisSideScroll.querySelector( "a.sidescroll-prev"), disabledClassStr );

			if( rwdButton = thisSideScroll.querySelector( "a.sidescroll-rwd") ){
				addClass(rwdButton, disabledClassStr );
			}
		}
	});

	lib._toggleNavigation = toggleNavigation;
})( this, this.overthrow );
