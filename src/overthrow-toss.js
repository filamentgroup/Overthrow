/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, o, undefined ){

	// o is overthrow reference from overthrow-polyfill.js
	if( o === undefined ){
		w.overthrow = o = {};
	}

	// Easing can use any of Robert Penner's equations (http://www.robertpenner.com/easing_terms_of_use.html). By default, overthrow includes ease-out-cubic
	// arguments: t = current iteration, b = initial value, c = end value, d = total iterations
	// use w.overthrow.easing to provide a custom function externally, or pass an easing function as a callback to the toss method
	o.easing = function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	};

	// requestAnimationFrame pfill
	var raf = (function(){
		return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
				w.setTimeout(callback, 1000 / 60);
			};
	})();

	// tossing object keeps track of currently tossing elements. true during a programatic scroll
	var tossingElems = {};
	o.tossing = function( elem, state ){
		if( state !== undefined ){
			tossingElems[ elem ] = state;
		}
		return tossingElems[ elem ];
	};

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
		o.tossing( elem, false );
		var i = 0,
			sLeft = elem.scrollLeft,
			sTop = elem.scrollTop,
			// Toss defaults
			op = {
				top: "+0",
				left: "+0",
				duration: 200,
				easing: o.easing,
				finished: function() {}
			},
			endLeft, endTop;

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

		o.tossing( elem, true );
		var startTime = new Date().getTime();
		var endTime = startTime + op.duration;
		var run = function(){
			var curTime = new Date().getTime();
			// if tossing is suddenly not true, return the callback
			if( !o.tossing( elem ) ){
				if( op.finished ){
					op.finished();
				}
			}
			// if the time is still less than the end of duration, keep scrolling
			else if( curTime < endTime ){
				i = ( ( curTime - startTime ) / op.duration ) * op.duration;
				elem.scrollLeft = op.easing( i, sLeft, op.left, op.duration );
				elem.scrollTop = op.easing( i, sTop, op.top, op.duration );
				return raf( run );
			}
			// if time is up,
			else{
				elem.scrollLeft = endLeft;
				elem.scrollTop = endTop;
				if( op.finished ){
					op.finished();
				}
				o.tossing( elem, false );
			}
		};

		raf( run );

		// Return the values, post-mixin, with end values specified
		return { top: endTop, left: endLeft, duration: o.duration, easing: o.easing };
	};

	// Intercept any throw in progress. deprecate
	o.intercept = function( elem ){
		if( !elem ){
			return;
		}
		o.tossing( elem, false );
	};

})( this, this.overthrow );
