(function( w ){
	if( !"querySelector" in w.document ){
		return;
	}

	var scrolls = w.document.querySelectorAll( ".overthrow-enabled .sidescroll-nextprev" );

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
				
				var slideWidth = thisScroll.querySelector( "li" ).offsetWidth,
					currScroll = thisScroll.scrollLeft,
					slideNum = Math.round( currScroll / slideWidth ),
					next = (e.type !== "keydown" && e.target.className.indexOf( "next" ) > -1) || e.keyCode === 39,
					newSlide = slideNum + ( next ? 1 : -1 ),
					newScroll = slideWidth * newSlide;

				overthrow.toss( thisScroll, { left: newScroll } );
				setTimeout( function(){ handled = false; }, 100 );
			}

		}

		function handleSnap(){
			var slideWidth = thisScroll.querySelector( "li" ).offsetWidth,
					currScroll = thisScroll.scrollLeft,
					slideNum = Math.round( currScroll / slideWidth );

			overthrow.toss( thisScroll, { left: slideWidth * slideNum } );
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
		thisScroll.addEventListener( "scroll", handleScroll, false );
 
		scrolls[ i ].insertBefore( nextPrev, thisScroll )


	}

}( this ));