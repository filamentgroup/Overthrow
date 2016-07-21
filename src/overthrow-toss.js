/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
/* overthrow.toss simply retains the overthrow.toss api by pulling in the external toss dependency and borring its methods */
(function( w, o, t, undefined ){

	// t is a reference to the external toss dependency
	if( t === undefined ){
		return;
	}

	// o is overthrow reference from overthrow-polyfill.js
	if( o === undefined ){
		w.overthrow = o = {};
	}

	o.toss = t;
	o.easing = t.easing;
	o.tossing = t.tossing;
	o.intercept = function( elem ){
			if( !elem ){
				return;
			}
			o.tossing( elem, false );
		};

})( this, this.overthrow, this.toss );
