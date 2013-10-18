(function(w, overthrow) {
	var lib = overthrow.sidescroller;

	lib.onEvent( "overthrow-init", w.document.documentElement, function( event ) {
		var options = event.overthrow.options || {},
			oEl = event.overthrow.sideScroll;

		function handleSkip( evt ) {
			var e = evt || w.event,
				target = e.target || e.srcElement,
				scroller = oEl.querySelector( ".sidescroll" ),
				rwd = (e.type !== "keydown" && target.className.indexOf( "sidescroll-rwd" ) > -1),
				ieID = "overthrow" + (new Date().getTime());

			if( target && target.nodeName !== "A" ){
				return;
			}

			w.overthrow.toss( scroller, {
				left: rwd ? 0 : ( scroller.querySelector( "ul" ).offsetWidth - oEl.offsetWidth )
			});
		}

		if( options.skipLinks === true ) {
			var nav = document.createElement( "div" ),
				navLinks = "<a href='#' class='sidescroll-rwd'>Skip to start</a>" +
					"<a href='#' class='sidescroll-ff'>Skip to end</a>";

			nav.setAttribute( "class", "sidescroll-skip-nav" );
			nav.innerHTML = navLinks;
			nav.addEventListener( "click", handleSkip );

			oEl.appendChild( nav );
		}
	});

})( this, this.overthrow );