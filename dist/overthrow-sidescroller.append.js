(function(w, overthrow) {
	var lib = overthrow.sidescroller;

	function append( event ) {
		var options = event.overthrow || {}, append, scroller, ul;

		if( options.name !== "append" ){
			return;
		}

		append = options.arguments[0];
		scroller = event.target || event.srcElement;
		ul = scroller.querySelector( "ul" );

		// make sure the new element doesn't jog the scroll bar
		append.style.visibility = "hidden";
		append.style.position = "absolute";

		// add the new element to the dom so we can get an accurate width
		ul.appendChild( append );
		ul.style.width = (ul.offsetWidth + append.offsetWidth) + "px";

		// return the element to normal operating for the purposes of the scroller
		append.style.visibility = "visible";
		append.style.position = "static";
	}

	lib.onEvent( "overthrow-init", w.document.documentElement, function( event ) {
		var scroller = event.overthrow.sideScroll,
			options = event.overthrow.options || {};

		lib.onEvent( "overthrow-method", scroller, append);
	});
})( this, this.overthrow );
