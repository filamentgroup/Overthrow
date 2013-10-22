/*
 Overthrow unit tests - using qUnit
 */

window.onload = function(){

	var li, scroller, testElem, overkill = 10000, defaultTimeout = 600;

	function setup( opts ) {
		testElem = document.querySelector( "#testelem" );
		scroller = testElem.querySelector( ".overthrow.sidescroll" );
		scroller.scrollLeft = 0;
		li = testElem.querySelector( "li" );
		overthrow.sidescroller( [testElem], opts || {fixedItemWidth: true} );
	}

	module( "disabled nav", {
		setup: function() {
			setup({ fixedItemWidth: true, disableNav: true });
		}
	});

	function nextDisabled(){
		return testElem.querySelectorAll(".sidescroll-next.disabled");
	}

	function prevDisabled(){
		return testElem.querySelectorAll(".sidescroll-prev.disabled");
	}

	test( "only nav prev should be disabled initially", function() {
		var next, prev;

		prev = prevDisabled();
		equal( prev.length, 1 );

		next = nextDisabled();
		equal( next.length, 0 );
	});

	asyncTest( "nav next should be disabled after scroll", function() {
		expect( 2 );

		var next;

		next = nextDisabled();
		equal( next.length, 0 );

		scroller.scrollLeft = overkill;

		setTimeout(function() {
			next = nextDisabled();

			equal( next.length, 1 );
			start();
		}, defaultTimeout);
	});

	asyncTest( "both should be active in center", function() {
		expect( 4 );

		var next, prev;

		next = nextDisabled();
		prev = prevDisabled();

		// check the default state
		equal( next.length, 0 );
		equal( prev.length, 1 );

		// move into the scrolling region
		scroller.scrollLeft = 10;

		setTimeout(function() {
			prev = prevDisabled();
			next = nextDisabled();

			// both buttons should be "clickable"
			equal( prev.length, 0, "Prev link is clickable" );
			equal( next.length, 0, "Next link is clickable" );
			start();
		}, defaultTimeout);
	});

	var newSlide, currentSlides;

	module( "append method", {
		setup: function(){
			setup({ fixedItemWidth: true, disableNav: true });

			var img = document.createElement( "img");

			newSlide = document.createElement( "li" );
			currentSlides = testElem.querySelectorAll( "li" );

			img.src = "../examples/sidescroller/img/monkey.jpg";
			newSlide.appendChild( img );
		}
	});

	test( "adds elements to the scrolling region", function(){
		overthrow.sidescroller( [testElem], "append", newSlide );

		equal( currentSlides.length + 1, testElem.querySelectorAll( "li" ).length );
	});

	// TODO these set timeouts are getting scarry now :(
	asyncTest( "disabled next nav is enabled when new element is appended", function() {
		expect( 3 );

		next = nextDisabled();
		equal( next.length, 0 );

		scroller.scrollLeft = overkill;

		// wait for the disabled nav mechanics to pick up the full scroll
		setTimeout(function() {
			// make sure the next button is disabled
			next = nextDisabled();
			equal( next.length, 1 );

			// add a new element
			overthrow.sidescroller( [testElem], "append", newSlide );

			// wait for the disabled nav mechanics to pick up the new element
			setTimeout(function() {

				// make sure the next nav is disabled
				next = nextDisabled();
				equal( next.length, 0 );

				start();
			}, defaultTimeout);
		}, defaultTimeout);
	});

	var li;

	function near( value, exact, range ) {
		range = range || 1;

		ok( value < exact + range && value > exact - range,
			  value + " should be between " + (exact - range) + " and " + (exact + range) );
	}

	module( "goTo method", {setup: setup} );

	asyncTest( "changing slides changes scroll position", function() {
		expect( 2 );

		equal( scroller.scrollLeft, 0 );

		overthrow.sidescroller( [testElem], "goTo", "1" );

		setTimeout(function() {
			near( scroller.scrollLeft, li.offsetWidth );
			start();
		}, defaultTimeout);
	});

	asyncTest( "using -1 reduces scroll position", function() {
		expect( 2 );

		equal( scroller.scrollLeft, 0 );

		overthrow.sidescroller( [testElem], "goTo", "2" );

		setTimeout(function() {
			overthrow.sidescroller( [testElem], "goTo", "-1" );

			setTimeout(function() {
				near( scroller.scrollLeft, li.offsetWidth );
				start();
			}, defaultTimeout);
		}, defaultTimeout);
	});

	asyncTest( "using +1 reduces scroll position", function() {
		expect( 2 );

		equal( scroller.scrollLeft, 0 );

		setTimeout(function() {
			overthrow.sidescroller( [testElem], "goTo", "+1" );

			setTimeout(function() {
				near( scroller.scrollLeft, li.offsetWidth );
				start();
			}, defaultTimeout);
		}, defaultTimeout);
	});

	module( "snapping", {
		setup: function() {
			setup( {fixedItemWidth: true, snapScroll: true} );
		}
	});

	asyncTest( "setting scroll position outside slide snaps to slide", function() {
		expect( 1 );

		// force snap to the first second slide
		scroller.scrollLeft = li.offsetWidth/2 + 20;

		// once the snap takes place the new offset width should be at the second slide
		setTimeout(function() {
			near( scroller.scrollLeft, li.offsetWidth );
			start();
		}, defaultTimeout);
	});

	module( "events", {setup: setup} );

	// TODO is there any easy way to expost the handle click so that we can test the
	//			next and prev events. Also resizing?
	asyncTest( "scroll, refresh events are fired", function() {
		expect( 2 );

		overthrow.sidescroller.onEvent( "overthrow-refresh", testElem, function() {
			ok( true, "ovethrow-refresh triggered" );
		});

		overthrow.sidescroller( [testElem], "refresh" );

		overthrow.sidescroller.onEvent( "overthrow-scroll", testElem, function() {
			ok( true, "ovethrow-scroll triggered" );
			start();
		});

		scroller.scrollLeft = li.offsetWidth + 20;
	});

	module( "skip links", {
		setup: function() {
			setup({ disableNav: true, fixedItemWidth: true, snapScroll: true, skipLinks: true });
		}
	});

	test( "Nav items are added to the sidescroller.", function(){
		expect( 1 );
		ok( testElem.querySelector( ".sidescroll-skip-nav a" ).length !== 0 );
	});

	asyncTest( "Skip links enable/disable nav items correctly.", function(){
		ok( testElem.querySelector( ".sidescroll-rwd" ).getAttribute( "class" ).indexOf( "disabled") > -1, "Rewind link starts out with `disabled` class." );

		(function() {
			var rwd = testElem.querySelector( ".sidescroll-rwd" ).getAttribute( "class" ).indexOf( "disabled") > -1,
				ff = testElem.querySelector( ".sidescroll-ff" ).getAttribute( "class" ).indexOf( "disabled") > -1;

			ok( rwd && !ff, "Rewind/previous links are intially disabled." );
		}());

		scroller.scrollLeft = overkill;
		setTimeout(function() {
			var rwd = testElem.querySelector( ".sidescroll-rwd" ).getAttribute( "class" ).indexOf( "disabled") > -1,
				ff = testElem.querySelector( ".sidescroll-ff" ).getAttribute( "class" ).indexOf( "disabled") > -1;

			ok( !rwd && ff, "Skipping to the end disables fast-forward/previous controls." );
		},defaultTimeout);
		start();
	});
};
