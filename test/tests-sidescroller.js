/*
 Overthrow unit tests - using qUnit
 */

window.onload = function(){

	var testElems = document.querySelectorAll( "#testelem" );

	module( "properties", {
		setup: function(){
			overthrow.sidescroller( testElems );
		}
	});

	/* TESTS HERE */
	test( 'API Properties: overthrow is defined', function() {
		ok( overthrow.sidescroller );
	});

	test( "nav prev should be disabled initially", function() {
		//
	});

	test( "nav next should be disabled after scroll", function() {
		//
	});
};
