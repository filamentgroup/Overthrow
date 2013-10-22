/*
	overthrow responsive sidescroller extension
	(c) 2013: Scott Jehl, Filament Group, Inc.
	MIT License
*/

(function( w, o ){


	if( !o || !"querySelector" in w.document ){
		return;
	}

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

	o.sidescroller = function( elems, options ){
		var scrolls = elems,
			evtPrefix = "overthrow",
			evtNext = evtPrefix + "-next",
			evtPrev = evtPrefix + "-prev",
			evtMethod = evtPrefix + "-method",
			evtRefresh = evtPrefix + "-refresh",
			evtResize = evtPrefix + "-resize",
			disabledClassStr = " disabled",
			snapScroll = options && options.snapScroll,
			skip = options && options.skipLinks,
			rewind = options && options.rewind,
			snapTolerance = options && options.snapTolerance !== undefined ? options.snapTolerance : 30,
			args = arguments;

			options = options || {};

		for( var i = 0; i < scrolls.length; i++ ){

			(function(){
				var thisSideScroll = scrolls[ i ],
					thisScroll = scrolls[ i ].querySelector( ".overthrow" ),
					nextPrev = w.document.createElement( "div" ),
					slideNum = 0,
					ieID = "overthrow" + (new Date().getTime()),
					handled = false,
					controls = "<a href='#' class='sidescroll-prev'>Previous</a>" +
						"<a href='#' class='sidescroll-next'>Next</a>",
					skiplinks = "<a href='#' class='sidescroll-rwd'>First</a>" +
						"<a href='#' class='sidescroll-ff'>Last</a>";

				// The second check for options prevents methods from being run on
				// uninitialized overthrow elements
				if( typeof options === "string"	&& thisSideScroll.options ) {
					sendEvent(
						thisSideScroll, // elem to receive event
						evtMethod,
						{ "name": options, "arguments": Array.prototype.slice.call(args, 2) },
						thisSideScroll.ieID
					);

					refresh( thisSideScroll.options );

					return;
				}

				// prevent re-init
				if( thisSideScroll.initialized ){
					return;
				}

				thisSideScroll.initialized = true;
				thisSideScroll.options = options;
				thisSideScroll.setAttribute( "tabindex", "0" );

				// oldIE will need some expando event props
				// TODO move to method
				if( w.document.attachEvent ){
					// these are iterators to trigger a property mutate event in IE8
					w.document.documentElement[ evtPrev ] = 0;
					w.document.documentElement[ evtNext ] = 0;
					w.document.documentElement[ evtMethod ] = 0;
					w.document.documentElement[ evtRefresh ] = 0;
					w.document.documentElement[ evtResize ] = 0;

					// these for for the event data when that property iterates
					w.document.documentElement[ ieID ] = {};
					w.document.documentElement[ ieID ][ evtPrev ] = {};
					w.document.documentElement[ ieID ][ evtNext ] = {};
					w.document.documentElement[ ieID ][ evtMethod ] = {};
					w.document.documentElement[ ieID ][ evtRefresh ] = {};
					w.document.documentElement[ ieID ][ evtResize ] = {};

					thisSideScroll.ieID = ieID;
				}

				nextPrev.className = "sidescroll-nextprev-links";

				if( skip ) {
					controls = controls + skiplinks;
				}
				nextPrev.innerHTML = controls;

				function setSlideWidths(){
					var slides = thisScroll.querySelectorAll( "li" ),
						percent = 100 / slides.length + "%";
					for( var i = 0; i < slides.length; i++ ){
						slides[ i ].style.width = percent;
					}
				}

				function setScrollableWidth(){
					var slides = thisScroll.querySelectorAll( "li" ),
					  container = thisScroll.querySelector( "ul" );

					container.style.width = (slides[0].offsetWidth * slides.length) + "px";
				}

				function refresh( options ) {
					if( !options || !options.fixedItemWidth ) {
						setSlideWidths();
					} else {
						setScrollableWidth();
					}

					sendEvent(
						thisSideScroll, // elem to receive event
						evtRefresh,
						{},
						thisSideScroll.ieID
					);
				}

				function getActiveSlides( left ){
					var slides = thisScroll.querySelectorAll( "li" ),
						numSlides = slides.length,
						slidesWidth = thisScroll.offsetWidth,
						slideWidth = slides[ 0 ].offsetWidth,
						scrollLeft = left !== undefined ? left : thisScroll.scrollLeft,
						startSlide = Math.round( scrollLeft / slideWidth ),
						tollerance = 10,
						ret = [];

					startSlide = Math.max( 0, startSlide );
					startSlide = Math.min( numSlides, startSlide );

					ret.push(startSlide);
					for( var i = 2; i < numSlides; i++ ){
						if( i * slideWidth < slidesWidth + tollerance ) {
							ret.push( startSlide + i - 1 );
						}
					}

					slideNum = startSlide;
					return ret;
				}

				function determineSlideLength( activeSlides, opts ){
					var slideLength = 1;
					if( opts && opts.slideLength ){
						if( opts.slideLength === "all" ){
							slideLength = activeSlides.length;
						} else {
							slideLength = parseInt( opts.slideLength, 10 );
						}
					}

					if( isNaN( slideLength ) ){
						slideLength = 1;
					}
					return slideLength;
				}

				// expose the getactiveslides function on the overthrow element
				thisSideScroll.getActiveSlides = getActiveSlides;

				function handleClick( evt ){

					var e = evt || w.event;

					if( e.preventDefault ){
						e.preventDefault();
					}
					else{
						e.returnValue = false;
					}

					if( e.type === "keydown" || ( handled === false || handled === e.type ) ){
						handled = e.type;

						o.intercept();
						var slides = thisScroll.querySelectorAll( "li" ),
							target = e.target || e.srcElement,
							slidesWidth = thisScroll.offsetWidth,
							slideWidth = slides[ 0 ].offsetWidth,
							currScroll = thisScroll.scrollLeft,
							slideNum = Math.round( currScroll / slideWidth ),
							ff = target.className.indexOf( "ff" ) > -1,
							rwd = target.className.indexOf( "rwd" ) > -1,
							next = (e.type !== "keydown" && target.className.indexOf( "next" ) > -1) || e.keyCode === 39,
							slideLength = determineSlideLength( getActiveSlides(), options ),
							newSlide = slideNum + ( next ? slideLength : -slideLength ),
							newScroll = slideWidth * newSlide,
							scrollWidth = thisScroll.scrollWidth - slidesWidth;

						if( target && target.nodeName !== "A" ){
							return;
						}
						if( rwd ) {
							newScroll = 0;
						}
						if( ff ) {
							newScroll = scrollWidth;
						}
						// if can't go left, go to end
						if( rewind ){

							if( newScroll < 0 ){
								newScroll = scrollWidth;
							}
							else if( newScroll > scrollWidth ){
								newScroll = 0;
							}
						}
						else {
							if( newScroll < 0 ){
								newScroll = 0;
							}
							else if( newScroll > scrollWidth ){
								newScroll = scrollWidth;
							}
						}

						var newActive = getActiveSlides( newScroll );

						// if we're planning to show the last slide, force the scroll out to the
						// end of the scrollable area. Necessary to force partially displayed
						// elements when the scroll is manual (not snapped) or the elements are
						// fixed width

						// TODO might be jarring, consider sorting the active slides as a right
						//			offset instead of just forcing the last distance.
						if( newActive[newActive.length - 1] == slides.length - 1 ) {
							newScroll = thisScroll.querySelector( "ul" ).offsetWidth - slidesWidth;
						}

						// TODO probably only need the second condition1
						if( newActive[ 0 ] !== slideNum || newScroll !== currScroll ){

							o.toss( thisScroll, {
								left: newScroll,
								easing: options.easing
							});

							sendEvent(
								thisSideScroll, // elem to receive event
								next ? evtNext : evtPrev, // evt name
								{
									active: newActive, // active slides
									originalEvent: e
								},
								ieID
							);
						}

						setTimeout( function(){ handled = false; }, 900 );
					}
				}

				var scrollStart = false;
				function handleSnap( e ){
					o.intercept();
					var slideWidth = thisScroll.querySelector( "li" ).offsetWidth,
						currScroll = thisScroll.scrollLeft,
						newSlide = Math.round( currScroll / slideWidth );

					if( scrollStart !== false ){
						var distScrolled = currScroll - scrollStart;
						if( Math.abs( distScrolled ) > snapTolerance ){
							newSlide = slideNum + ( distScrolled > 0 ? 1 : -1 );
						}

					}

					var newScroll = slideWidth * newSlide;

					o.toss( thisScroll, {
						left: newScroll,
						duration: 20,
						easing: options.easing
					});

					if( slideNum !== newSlide ){
						sendEvent(
							thisSideScroll, // elem to receive event
							newSlide > slideNum ? evtNext : evtPrev, // evt name
							{
								active: getActiveSlides( newScroll ), // active slides
								originalEvent: e
							},
							ieID
						);
						slideNum = newSlide;
					}
				}

				var debounce;
				function handleResize( e ){
					clearTimeout(debounce);
					debounce = setTimeout(function(){
						sendEvent( thisSideScroll, evtPrefix + "-resize", {}, thisSideScroll.ieID );
						handleSnap( e );
					}, 100);
				}

				var debouncedos;
				function handleScroll( e ){
					if( overthrow.tossing ){
						return;
					}
					clearTimeout( debouncedos );
					debouncedos = setTimeout(function(){
						if( scrollStart === false ){
							scrollStart = thisScroll.scrollLeft;
						}
						if( snapScroll ){
							handleSnap( e );
						} else {
							sendEvent( thisSideScroll,	evtPrefix + "-scroll", {}, ieID );
						}

						scrollStart = false;
					}, 200);
				}

				function handleKey( e ){
					if( e.keyCode === 39 || e.keyCode === 37 ){
						handleClick( e );
					}
				}

				if( w.document.addEventListener ){
					nextPrev.addEventListener( "click", handleClick, false );
					nextPrev.addEventListener( "touchend", handleClick, false );
					w.addEventListener( "resize", handleResize, false );
					scrolls[ i ].addEventListener( "keydown", handleKey, false );

					thisScroll.addEventListener( "scroll", handleScroll, false );
				}
		 		else if( w.document.attachEvent ){
		 			nextPrev.attachEvent( "onclick", handleClick, false );
					w.attachEvent( "onresize", handleResize, false );
					scrolls[ i ].attachEvent( "onkeydown", handleKey, false );

					thisScroll.attachEvent( "onscroll", handleScroll, false );
		 		}

				thisSideScroll.insertBefore( nextPrev, thisScroll );

				refresh( options );

				// Todo this seems really fragile
				// side scroller init for plugins
				sendEvent(
					w.document.documentElement,
					evtPrefix + "-init",
					{ sideScroll: thisSideScroll, options: options },
					w.document.documentElement.ieID
				);
			}());
		}
	};

	// setup the document element to work with overthrow init
	// TODO use the body element, this feels super iffy
	if( w.document.attachEvent ){
		var initId = "overthrow-init" + (new Date().getTime());

		w.document.documentElement[ initId ] = {};
		w.document.documentElement[ initId ][ "overthrow-init" ] = 0;
		w.document.documentElement.ieID = initId;
	}

	o.sidescroller.onEvent = function( evt, elem, callback ){
		function cb( args ){
			var e = {
				type: evt,
				target: elem,
				overthrow: args.overthrow
			};
			callback( e );
		}
		if( w.document.addEventListener ){
			elem.addEventListener( evt, cb );
		}
		else if( w.document.attachEvent ){
			w.document.documentElement.attachEvent( "onpropertychange", function( event ) {
				if( event.propertyName === evt ){
					cb( w.document.documentElement[ elem.ieID ][ evt ] );
				}
			});
		}
	};
}( this, this.overthrow ));
