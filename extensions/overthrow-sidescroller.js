/*
	overthrow responsive sidescroller extension
	(c) 2013: Scott Jehl, Filament Group, Inc.
	MIT License
*/

(function( w, o ){


	if( !o || !"querySelector" in w.document ){
		return;
	}

	function sendEvent( elem, evt, args ){
		// TODO needs IE8 support
		if( document.createEvent ){
			var event = document.createEvent( "Event" );
			event.initEvent( evt, true, true );
			event.overthrow = args;
			elem.dispatchEvent( event );
		}
	}

	o.sidescroller = function( elems, options ){

		var scrolls = elems,
			evtPrefix = "overthrow",
			evtNext = evtPrefix + "-next",
			evtPrev = evtPrefix + "-prev",
			slideNum = 0,
			snapScroll = options && options.snapScroll,
			rewind = options && options.rewind;

		for( var i = 0; i < scrolls.length; i++ ){

			var thisScroll = scrolls[ i ].querySelector( ".overthrow" ),
				nextPrev = w.document.createElement( "div" ),
				handled;

			scrolls[ i ].setAttribute( "tabindex", "0" );

			nextPrev.className = "sidescroll-nextprev-links";

			nextPrev.innerHTML = "<a href='#' class='sidescroll-prev'>Previous</a><a href='#' class='sidescroll-next'>Next</a>";

			function getActiveSlides( left ){
				var slides = thisScroll.querySelectorAll( "li" ),
					numSlides = slides.length,
					slidesWidth = thisScroll.offsetWidth,
					slideWidth = slides[ 0 ].offsetWidth,
					scrollLeft = left !== undefined ? left : thisScroll.scrollLeft,
					startSlide = Math.round( scrollLeft / slideWidth ),
					valid = true,
					ret = [];

				startSlide = Math.max( 0, startSlide );
				startSlide = Math.min( numSlides, startSlide );

				ret[ 0 ] = startSlide;
				for( var i = 1; i < numSlides; i++ ){
					if( startSlide + (i * slideWidth) < slidesWidth){
						ret.push( startSlide + i);
					}
					else{
						valid = false;
					}
				}
				slideNum = startSlide;
				return ret;
			}

			// expose the getactiveslides function on the overthrow element
			scrolls[ i ].getActiveSlides = getActiveSlides;

			function handleClick( e ){
				e.preventDefault();
				if( e.type === "keydown" || !handled ){
					handled = true;
					o.intercept();
					var slides = thisScroll.querySelectorAll( "li" ),
						slidesWidth = thisScroll.offsetWidth,
						slideWidth = slides[ 0 ].offsetWidth,
						currScroll = thisScroll.scrollLeft,
						slideNum = Math.round( currScroll / slideWidth ),
						next = (e.type !== "keydown" && e.target.className.indexOf( "next" ) > -1) || e.keyCode === 39,
						newSlide = slideNum + ( next ? 1 : -1 ),
						newScroll = slideWidth * newSlide,
						scrollWidth = thisScroll.scrollWidth - slidesWidth;

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

					if( newActive[ 0 ] !== slideNum ){

						o.toss( thisScroll, { left: newScroll } );

						sendEvent(
							thisScroll, // elem to receive event
							next ? evtNext : evtPrev, // evt name
							{
								active: newActive, // active slides
								originalEvent: e
							}
						);
					}

					setTimeout( function(){ handled = false; }, 100 );
				}

			}

			function handleSnap( e ){
				o.intercept();
				var slideWidth = thisScroll.querySelector( "li" ).offsetWidth,
					currScroll = thisScroll.scrollLeft,
					newSlide = Math.round( currScroll / slideWidth ),
					newScroll = slideWidth * newSlide;

				o.toss( thisScroll, { left: newScroll, duration: 20 } );

				if( slideNum !== newSlide ){
					sendEvent(
						thisScroll, // elem to receive event
						newSlide > slideNum ? evtNext : evtPrev, // evt name
						{
							active: getActiveSlides( newScroll ), // active slides
							originalEvent: e
						}
					);
					slideNum = newSlide;
				}
			}

			var debounce;
			function handleResize( e ){
				clearTimeout(debounce);
				debounce = setTimeout(function(){
					handleSnap( e );
				}, 100);
			}

			var debouncedos;
			function handleScroll( e ){
				clearTimeout(debouncedos);
				debouncedos = setTimeout(function(){
					handleSnap( e );
				}, 200);
			}

			function handleKey( e ){
				if( e.keyCode === 39 || e.keyCode === 37 ){
					handleClick( e );
				}
			}


			nextPrev.addEventListener( "click", handleClick, false );
			nextPrev.addEventListener( "touchend", handleClick, false );
			w.addEventListener( "resize", handleResize, false );
			scrolls[ i ].addEventListener( "keydown", handleKey, false );
			if( snapScroll ){
				thisScroll.addEventListener( "scroll", handleScroll, false );
			}

			scrolls[ i ].insertBefore( nextPrev, thisScroll );


		}

	};

}( this, this.overthrow ));
