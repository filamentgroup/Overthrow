/*
	overthrow sidescroller extension
*/

(function( w, o ){


	if( !o || !"querySelector" in w.document ){
		return;
	}

	o.sidescroller = function( elems, options ){

		var scrolls = elems,
			roundedScroll = options && options.roundedScroll,
			rewind = options && options.rewind;

		for( var i = 0; i < scrolls.length; i++ ){

			var thisScroll = scrolls[ i ].querySelector( ".overthrow" ),
				nextPrev = w.document.createElement( "div" ),
				handled;

			scrolls[ i ].setAttribute( "tabindex", "0" );

			nextPrev.className = "sidescroll-nextprev-links";

			nextPrev.innerHTML = "<a href='#' class='sidescroll-prev'>Previous</a><a href='#' class='sidescroll-next'>Next</a>";

			function handleClick( e ){
				e.preventDefault();
				if( e.type === "keydown" || !handled ){
					handled = true;
					o.intercept();
					var slides = thisScroll.querySelectorAll( "li" ),
						slideWidth = slides[ 0 ].offsetWidth,
						currScroll = thisScroll.scrollLeft,
						slideNum = Math.round( currScroll / slideWidth ),
						next = (e.type !== "keydown" && e.target.className.indexOf( "next" ) > -1) || e.keyCode === 39,
						newSlide = slideNum + ( next ? 1 : -1 ),
						newScroll = slideWidth * newSlide;

					// if can't go left, go to end
					if( rewind ){

						var lastSlideLeft = slideWidth * ( slides.length - 2 );

						if( newScroll < 0 ){
							newScroll = lastSlideLeft;
						}
						else if( newScroll >= lastSlideLeft ){
							newScroll = 0;
						}
					}

					o.toss( thisScroll, { left: newScroll } );
					setTimeout( function(){ handled = false; }, 100 );
				}

			}

			function handleSnap(){
				o.intercept();
				var slideWidth = thisScroll.querySelector( "li" ).offsetWidth,
						currScroll = thisScroll.scrollLeft,
						slideNum = Math.round( currScroll / slideWidth );

				o.toss( thisScroll, { left: slideWidth * slideNum, duration: 20 } );
			}

			var debounce;
			function handleResize(){
				clearTimeout(debounce);
				debounce = setTimeout(handleSnap, 100);
			}

			var debouncedos;
			function handleScroll(){
				clearTimeout(debouncedos);
				debouncedos = setTimeout(handleSnap, 200);
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
			if( roundedScroll ){
				thisScroll.addEventListener( "scroll", handleScroll, false );
			}
	 
			scrolls[ i ].insertBefore( nextPrev, thisScroll );


		}

	};

}( this, this.overthrow ));