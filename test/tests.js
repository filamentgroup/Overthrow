/*
Overthrow unit tests - using qUnit
*/

window.onload = function(){
	
	var testElem = document.getElementById( "testelem" );
	
		
	
		
		/* TESTS HERE */ 
		test( 'API Properties: overthrow is defined', function() { 
			ok( overthrow );
		});
		
		test( 'API Properties: overthrow is an object', function() { 
			ok( typeof( overthrow ) === "object" );
		});
		
		
		test( 'API Properties: overthrow.set is defined', function() { 
			ok( overthrow.set );
		});
		
		test( 'API Properties: overthrow.set is a function', function() { 
			ok( typeof( overthrow.set ) === "function" );
		});
		
		
		test( 'API Properties: overthrow.forget is defined', function() { 
			ok( overthrow.forget );
		});
		
		test( 'API Properties: overthrow.forget is a function', function() { 
			ok( typeof( overthrow.forget ) === "function" );
		});
		
		test( 'API Properties: overthrow.support is defined', function() { 
			ok( overthrow.support );
		});
		
		test( 'API Properties: overthrow.support is a string', function() { 
			ok( typeof( overthrow.support ) === "string" );
		});
		
		test( 'API Properties: overthrow.toss is defined', function() { 
			ok( overthrow.toss );
		});
		
		test( 'API Properties: overthrow.toss is a function', function() { 
			ok( typeof( overthrow.toss ) === "function" );
		});
		
		test( 'API Properties: overthrow.closest is defined', function() { 
			ok( overthrow.closest );
		});
		
		test( 'API Properties: overthrow.closest is a function', function() { 
			ok( typeof( overthrow.closest ) === "function" );
		});
		
		test( 'API Properties: overthrow.intercept is defined', function() { 
			ok( overthrow.intercept );
		});
		
		test( 'API Properties: overthrow.intercept is a function', function() { 
			ok( typeof( overthrow.intercept ) === "function" );
		});
		
		test( 'API Properties: overthrow.easing is defined', function() { 
			ok( overthrow.intercept );
		});
		
		test( 'API Properties: overthrow.easing is a function', function() { 
			ok( typeof( overthrow.easing ) === "function" );
		});
		
		
		
		
		
		test( 'HTML element overthrow class is applied depending on overthrow-supporting browser', function() { 
			if(overthrow.support === "native" || overthrow.support === "polyfilled" ){
				ok( document.documentElement.className.indexOf( "overthrow" ) > -1 );
			}
			else {
				ok( document.documentElement.className.indexOf( "overthrow" ) === -1 );
			}
		});
		
		test( 'overthrow.forget destroys HTML class', function() { 
			overthrow.forget();
			ok( document.documentElement.className.indexOf( "overthrow" ) === -1 );
			overthrow.set();
		});
		
		test( 'overthrow.set adds HTML class', function() { 
			overthrow.forget();
			overthrow.set();
			ok( document.documentElement.className.indexOf( "overthrow" ) > -1 );
		});
		
		test( 'When set in an overthrow-supporting browser, the test element height is less than scrollHeight', function() { 
			if(overthrow.support === "native" || overthrow.support === "polyfilled" ){
				ok( testElem.offsetHeight < testElem.scrollHeight );
			}
			else {
				ok( "N/A in this browser" );
			}	
		});
		
		test( 'When set in an overthrow-supporting browser, the test element width is less than its scrollWidth', function() { 
			if(overthrow.support === "native" || overthrow.support === "polyfilled" ){
				ok( testElem.offsetWidth < testElem.scrollWidth );
			}
			else {
				ok( "N/A in this browser" );
			}	
		});
		
		
		test( 'When destroyed in an overthrow-supporting browser, the test element height is same as its scrollHeight', function() { 
			overthrow.forget();
			if(overthrow.support === "native" || overthrow.support === "polyfilled" ){
				ok( testElem.offsetHeight === testElem.scrollHeight );
			}
			else {
				ok( "N/A in this browser" );
			}	
			overthrow.set();
		});
		
		test( 'When destroyed in an overthrow-supporting browser, the test element width is same as its scrollWidth', function() { 
			overthrow.forget();
			if(overthrow.support === "native" || overthrow.support === "polyfilled" ){
				ok( testElem.offsetWidth === testElem.scrollWidth );
			}
			else {
				ok( "N/A in this browser" );
			}	
			overthrow.set();
		});
		
		
		
		
		
		
		
		

	
};