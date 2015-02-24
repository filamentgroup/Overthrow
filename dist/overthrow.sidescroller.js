/*! overthrow - An overflow:auto polyfill for responsive design. - v0.7.0 - 2015-02-23
* Copyright (c) 2015 Scott Jehl, Filament Group, Inc.; Licensed MIT */
/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, undefined ){
	
	var doc = w.document,
		docElem = doc.documentElement,
		enabledClassName = "overthrow-enabled",

		// Touch events are used in the polyfill, and thus are a prerequisite
		canBeFilledWithPoly = "ontouchmove" in doc,
		
		// The following attempts to determine whether the browser has native overflow support
		// so we can enable it but not polyfill
		nativeOverflow = 
			// Features-first. iOS5 overflow scrolling property check - no UA needed here. thanks Apple :)
			"WebkitOverflowScrolling" in docElem.style ||
			// Test the windows scrolling property as well
			"msOverflowStyle" in docElem.style ||
			// Touch events aren't supported and screen width is greater than X
			// ...basically, this is a loose "desktop browser" check. 
			// It may wrongly opt-in very large tablets with no touch support.
			( !canBeFilledWithPoly && w.screen.width > 800 ) ||
			// Hang on to your hats.
			// Whitelist some popular, overflow-supporting mobile browsers for now and the future
			// These browsers are known to get overlow support right, but give us no way of detecting it.
			(function(){
				var ua = w.navigator.userAgent,
					// Webkit crosses platforms, and the browsers on our list run at least version 534
					webkit = ua.match( /AppleWebKit\/([0-9]+)/ ),
					wkversion = webkit && webkit[1],
					wkLte534 = webkit && wkversion >= 534;
					
				return (
					/* Android 3+ with webkit gte 534
					~: Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13 */
					ua.match( /Android ([0-9]+)/ ) && RegExp.$1 >= 3 && wkLte534 ||
					/* Blackberry 7+ with webkit gte 534
					~: Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0 Mobile Safari/534.11+ */
					ua.match( / Version\/([0-9]+)/ ) && RegExp.$1 >= 0 && w.blackberry && wkLte534 ||
					/* Blackberry Playbook with webkit gte 534
					~: Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/0.0.1 Safari/534.8+ */   
					ua.indexOf( "PlayBook" ) > -1 && wkLte534 && !ua.indexOf( "Android 2" ) === -1 ||
					/* Firefox Mobile (Fennec) 4 and up
					~: Mozilla/5.0 (Mobile; rv:15.0) Gecko/15.0 Firefox/15.0 */
					ua.match(/Firefox\/([0-9]+)/) && RegExp.$1 >= 4 ||
					/* WebOS 3 and up (TouchPad too)
					~: Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.48 Safari/534.6 TouchPad/1.0 */
					ua.match( /wOSBrowser\/([0-9]+)/ ) && RegExp.$1 >= 233 && wkLte534 ||
					/* Nokia Browser N8
					~: Mozilla/5.0 (Symbian/3; Series60/5.2 NokiaN8-00/012.002; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/533.4 (KHTML, like Gecko) NokiaBrowser/7.3.0 Mobile Safari/533.4 3gpp-gba 
					~: Note: the N9 doesn't have native overflow with one-finger touch. wtf */
					ua.match( /NokiaBrowser\/([0-9\.]+)/ ) && parseFloat(RegExp.$1) === 7.3 && webkit && wkversion >= 533
				);
			})();

	// Expose overthrow API
	w.overthrow = {};

	w.overthrow.enabledClassName = enabledClassName;

	w.overthrow.addClass = function(){
		if( docElem.className.indexOf( w.overthrow.enabledClassName ) === -1 ){
			docElem.className += " " + w.overthrow.enabledClassName;
		}
	};

	w.overthrow.removeClass = function(){
		docElem.className = docElem.className.replace( w.overthrow.enabledClassName, "" );
	};

	// Enable and potentially polyfill overflow
	w.overthrow.set = function(){
			
		// If nativeOverflow or at least the element canBeFilledWithPoly, add a class to cue CSS that assumes overflow scrolling will work (setting height on elements and such)
		if( nativeOverflow ){
			w.overthrow.addClass();
		}

	};

	// expose polyfillable 
	w.overthrow.canBeFilledWithPoly = canBeFilledWithPoly;

	// Destroy everything later. If you want to.
	w.overthrow.forget = function(){

		w.overthrow.removeClass();
		
	};
		
	// Expose overthrow API
	w.overthrow.support = nativeOverflow ? "native" : "none";
		
})( this );

/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, o, undefined ){

	// o is overthrow reference from overthrow-polyfill.js
	if( o === undefined ){
		return;
	}

	// Easing can use any of Robert Penner's equations (http://www.robertpenner.com/easing_terms_of_use.html). By default, overthrow includes ease-out-cubic
	// arguments: t = current iteration, b = initial value, c = end value, d = total iterations
	// use w.overthrow.easing to provide a custom function externally, or pass an easing function as a callback to the toss method
	o.easing = function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	};

	// tossing property is true during a programatic scroll
	o.tossing = false;

	// Keeper of intervals
	var timeKeeper;

	/* toss scrolls and element with easing

	// elem is the element to scroll
	// options hash:
		* left is the desired horizontal scroll. Default is "+0". For relative distances, pass a string with "+" or "-" in front.
		* top is the desired vertical scroll. Default is "+0". For relative distances, pass a string with "+" or "-" in front.
		* duration is the number of milliseconds the throw will take. Default is 100.
		* easing is an optional custom easing function. Default is w.overthrow.easing. Must follow the easing function signature

	*/
	o.toss = function( elem, options ){
		o.intercept();
		var i = 0,
			sLeft = elem.scrollLeft,
			sTop = elem.scrollTop,
			// Toss defaults
			op = {
				top: "+0",
				left: "+0",
				duration: 50,
				easing: o.easing,
				finished: function() {}
			},
			endLeft, endTop, finished = false;

		// Mixin based on predefined defaults
		if( options ){
			for( var j in op ){
				if( options[ j ] !== undefined ){
					op[ j ] = options[ j ];
				}
			}
		}

		// Convert relative values to ints
		// First the left val
		if( typeof op.left === "string" ){
			op.left = parseFloat( op.left );
			endLeft = op.left + sLeft;
		}
		else {
			endLeft = op.left;
			op.left = op.left - sLeft;
		}
		// Then the top val
		if( typeof op.top === "string" ){

			op.top = parseFloat( op.top );
			endTop = op.top + sTop;
		}
		else {
			endTop = op.top;
			op.top = op.top - sTop;
		}

		o.tossing = true;
		timeKeeper = setInterval(function(){
			if( i++ < op.duration ){
				elem.scrollLeft = op.easing( i, sLeft, op.left, op.duration );
				elem.scrollTop = op.easing( i, sTop, op.top, op.duration );
			}
			else{
				if( endLeft !== elem.scrollLeft ){
					elem.scrollLeft = endLeft;
				} else {
					// if the end of the vertical scrolling has taken place
					// we know that we're done here call the callback
					// otherwise signal that horizontal scrolling is complete
					if( finished ) {
						op.finished();
					}
					finished = true;
				}

				if( endTop !== elem.scrollTop ){
					elem.scrollTop = endTop;
				} else {
					// if the end of the horizontal scrolling has taken place
					// we know that we're done here call the callback
					if( finished ) {
						op.finished();
					}
					finished = true;
				}

				o.intercept();
			}
		}, 1 );

		// Return the values, post-mixin, with end values specified
		return { top: endTop, left: endLeft, duration: o.duration, easing: o.easing };
	};

	// Intercept any throw in progress
	o.intercept = function(){
		clearInterval( timeKeeper );
		o.tossing = false;
	};

})( this, this.overthrow );

/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, o, undefined ){

	// o is overthrow reference from overthrow-polyfill.js
	if( o === undefined ){
		return;
	}

	o.scrollIndicatorClassName = "overthrow";
	
	var doc = w.document,
		docElem = doc.documentElement,
		// o api
		nativeOverflow = o.support === "native",
		canBeFilledWithPoly = o.canBeFilledWithPoly,
		configure = o.configure,
		set = o.set,
		forget = o.forget,
		scrollIndicatorClassName = o.scrollIndicatorClassName;

	// find closest overthrow (elem or a parent)
	o.closest = function( target, ascend ){
		return !ascend && target.className && target.className.indexOf( scrollIndicatorClassName ) > -1 && target || o.closest( target.parentNode );
	};
		
	// polyfill overflow
	var enabled = false;
	o.set = function(){
			
		set();

		// If nativeOverflow or it doesn't look like the browser canBeFilledWithPoly, our job is done here. Exit viewport left.
		if( enabled || nativeOverflow || !canBeFilledWithPoly ){
			return;
		}

		w.overthrow.addClass();

		enabled = true;

		o.support = "polyfilled";

		o.forget = function(){
			forget();
			enabled = false;
			// Remove touch binding (check for method support since this part isn't qualified by touch support like the rest)
			if( doc.removeEventListener ){
				doc.removeEventListener( "touchstart", start, false );
			}
		};

		// Fill 'er up!
		// From here down, all logic is associated with touch scroll handling
			// elem references the overthrow element in use
		var elem,
			
			// The last several Y values are kept here
			lastTops = [],
	
			// The last several X values are kept here
			lastLefts = [],
			
			// lastDown will be true if the last scroll direction was down, false if it was up
			lastDown,
			
			// lastRight will be true if the last scroll direction was right, false if it was left
			lastRight,
			
			// For a new gesture, or change in direction, reset the values from last scroll
			resetVertTracking = function(){
				lastTops = [];
				lastDown = null;
			},
			
			resetHorTracking = function(){
				lastLefts = [];
				lastRight = null;
			},
		
			// On webkit, touch events hardly trickle through textareas and inputs
			// Disabling CSS pointer events makes sure they do, but it also makes the controls innaccessible
			// Toggling pointer events at the right moments seems to do the trick
			// Thanks Thomas Bachem http://stackoverflow.com/a/5798681 for the following
			inputs,
			setPointers = function( val ){
				inputs = elem.querySelectorAll( "textarea, input" );
				for( var i = 0, il = inputs.length; i < il; i++ ) {
					inputs[ i ].style.pointerEvents = val;
				}
			},
			
			// For nested overthrows, changeScrollTarget restarts a touch event cycle on a parent or child overthrow
			changeScrollTarget = function( startEvent, ascend ){
				if( doc.createEvent ){
					var newTarget = ( !ascend || ascend === undefined ) && elem.parentNode || elem.touchchild || elem,
						tEnd;
							
					if( newTarget !== elem ){
						tEnd = doc.createEvent( "HTMLEvents" );
						tEnd.initEvent( "touchend", true, true );
						elem.dispatchEvent( tEnd );
						newTarget.touchchild = elem;
						elem = newTarget;
						newTarget.dispatchEvent( startEvent );
					}
				}
			},
			
			// Touchstart handler
			// On touchstart, touchmove and touchend are freshly bound, and all three share a bunch of vars set by touchstart
			// Touchend unbinds them again, until next time
			start = function( e ){

				// Stop any throw in progress
				if( o.intercept ){
					o.intercept();
				}
				
				// Reset the distance and direction tracking
				resetVertTracking();
				resetHorTracking();
				
				elem = o.closest( e.target );
					
				if( !elem || elem === docElem || e.touches.length > 1 ){
					return;
				}			

				setPointers( "none" );
				var touchStartE = e,
					scrollT = elem.scrollTop,
					scrollL = elem.scrollLeft,
					height = elem.offsetHeight,
					width = elem.offsetWidth,
					startY = e.touches[ 0 ].pageY,
					startX = e.touches[ 0 ].pageX,
					scrollHeight = elem.scrollHeight,
					scrollWidth = elem.scrollWidth,
				
					// Touchmove handler
					move = function( e ){
					
						var ty = scrollT + startY - e.touches[ 0 ].pageY,
							tx = scrollL + startX - e.touches[ 0 ].pageX,
							down = ty >= ( lastTops.length ? lastTops[ 0 ] : 0 ),
							right = tx >= ( lastLefts.length ? lastLefts[ 0 ] : 0 );
							
						// If there's room to scroll the current container, prevent the default window scroll
						if( ( ty > 0 && ty < scrollHeight - height ) || ( tx > 0 && tx < scrollWidth - width ) ){
							e.preventDefault();
						}
						// This bubbling is dumb. Needs a rethink.
						else {
							changeScrollTarget( touchStartE );
						}
						
						// If down and lastDown are inequal, the y scroll has changed direction. Reset tracking.
						if( lastDown && down !== lastDown ){
							resetVertTracking();
						}
						
						// If right and lastRight are inequal, the x scroll has changed direction. Reset tracking.
						if( lastRight && right !== lastRight ){
							resetHorTracking();
						}
						
						// remember the last direction in which we were headed
						lastDown = down;
						lastRight = right;							
						
						// set the container's scroll
						elem.scrollTop = ty;
						elem.scrollLeft = tx;
					
						lastTops.unshift( ty );
						lastLefts.unshift( tx );
					
						if( lastTops.length > 3 ){
							lastTops.pop();
						}
						if( lastLefts.length > 3 ){
							lastLefts.pop();
						}
					},
				
					// Touchend handler
					end = function( e ){

						// Bring the pointers back
						setPointers( "auto" );
						setTimeout( function(){
							setPointers( "none" );
						}, 450 );
						elem.removeEventListener( "touchmove", move, false );
						elem.removeEventListener( "touchend", end, false );
					};
				
				elem.addEventListener( "touchmove", move, false );
				elem.addEventListener( "touchend", end, false );
			};
			
		// Bind to touch, handle move and end within
		doc.addEventListener( "touchstart", start, false );
	};
		
})( this, this.overthrow );

/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, undefined ){
	
	// Auto-init
	w.overthrow.set();

}( this ));
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
