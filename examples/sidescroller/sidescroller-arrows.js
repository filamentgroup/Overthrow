(function( w ){
	if( !"querySelector" in w.document ){
		return;
	}

	var scrolls = w.document.querySelectorAll( ".overthrow-enabled .sidescroll-nextprev" );

	for( var i = 0; i < scrolls.length; i++ ){
		var thisScroll = scrolls[ i ].querySelector( ".overthrow" ),
			nextPrev = w.document.createElement( "div" ),
			handledRecently = false;

		nextPrev.className = "sidescroll-nextprev-links";

		nextPrev.innerHTML = "<a href='#' class='sidescroll-prev'>Previous</a><a href='#' class='sidescroll-next'>Next</a>";

		function handleClick( e ){
			e.preventDefault();
			if( !handledRecently ){
				handledRecently = true;
				var slideWidth = thisScroll.querySelector( "li" ).offsetWidth,
					currScroll = thisScroll.scrollLeft,
					slideNum = Math.round( currScroll / slideWidth ),
					newSlide = slideNum + ( e.target.className.indexOf( "next" ) > 0 ? 1 : -1 ),
					newScroll = slideWidth * newSlide;

				setTimeout( function(){ handledRecently = false; }, 300 );
				overthrow.toss( thisScroll, { left: newScroll } );
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


		nextPrev.addEventListener( "click", handleClick, false );
		nextPrev.addEventListener( "touchend", handleClick, false );
		w.addEventListener( "resize", handleResize, false );

		scrolls[ i ].insertBefore( nextPrev, thisScroll )


	}

}( this ));