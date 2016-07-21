/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
/* overthrow.toss simply retains the overthrow.toss api by pulling in the external toss dependency and borring its methods */
(function( w, t, undefined ){

	// t is a reference to the external toss dependency
	if( t === undefined ){
		return;
	}

	// w.overthrow is overthrow reference from overthrow-polyfill.js
	if( w.overthrow === undefined ){
		w.overthrow = {};
	}

	w.overthrow.toss = t;
	w.overthrow.easing = t.easing;
	w.overthrow.tossing = t.tossing;
	w.overthrow.intercept = function( elem ){
			if( !elem ){
				return;
			}
			w.overthrow.tossing( elem, false );
		};

})( this, this.toss );
