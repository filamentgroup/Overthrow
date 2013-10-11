/*
 Overthrow unit tests - using qUnit
 */

window.onload = function(){

	var scroller, testElem;

	module( "properties", {
		setup: function(){
      testElem = document.querySelector( "#testelem" );
			scroller = testElem.querySelector( ".overthrow.sidescroll" );
			scroller.scrollLeft = 0;
			overthrow.sidescroller( [testElem], {fixedItemWidth: true} );
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
		var next;

		next = nextDisabled();
		equal( next.length, 0 );

		console.log( scroller );
		scroller.scrollLeft = 10000;

		setTimeout(function() {
			next = nextDisabled();

			equal( next.length, 1 );
			start();
		}, 500);
	});
};
