/*
Overthrow unit tests - using qUnit
*/

window.onload = function(){
	
	var testElem = document.getElementById( "testelem" );

	

	overthrow.sidescroller( testElem  );

	
		
	
		
		/* TESTS HERE */ 
		test( 'API Properties: overthrow is defined', function() { 
			ok( overthrow.sidescroller );
		});
		

	
};