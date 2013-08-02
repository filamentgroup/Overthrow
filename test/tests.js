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
		
		
		
		
		test( 'HTML element overthrow-enabled class is applied depending on overthrow-supporting browser', function() { 
			if(overthrow.support === "native" || overthrow.support === "polyfilled" ){
				ok( document.documentElement.className.indexOf( "overthrow-enabled" ) > -1 );
			}
			else {
				ok( document.documentElement.className.indexOf( "overthrow-enabled" ) === -1 );
			}
		});

		test( 'overthrow.set adds HTML class with custom name', function() { 
			overthrow.forget();
			overthrow.enabledClassName = "prefixed-overthrow-enabled";
			overthrow.set();
			ok( document.documentElement.className.indexOf( "prefixed-overthrow-enabled" ) > -1 );
		});

		test( 'overthrow.forget destroys HTML class with custom name', function() { 
			overthrow.forget();
			ok( document.documentElement.className.indexOf( "prefixed-overthrow-enabled" ) === -1 );
			
			//since the following tests assume the class name to be the default, we set it back
			overthrow.enabledClassName = "overthrow-enabled";
			overthrow.set();
		});
		
		test( 'overthrow.forget destroys HTML class', function() { 
			overthrow.forget();
			ok( document.documentElement.className.indexOf( "overthrow-enabled" ) === -1 );
			overthrow.set();
		});
		
		test( 'overthrow.set adds HTML class', function() { 
			overthrow.forget();
			overthrow.set();
			ok( document.documentElement.className.indexOf( "overthrow-enabled" ) > -1 );
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
		
		
		test( 'Overthrow.toss method returns object of values', function(){
			var toss = overthrow.toss(testElem);
			ok( typeof toss === "object", "Object returned from toss method" );			
		});
		
		test( 'Overthrow.toss methods return includes top value', function(){
			var toss = overthrow.toss(testElem);
			ok( toss.top !== undefined, "Top is defined" );			
		});
		
		test( 'Overthrow.toss methods return top value is a number', function(){
			var toss = overthrow.toss(testElem);
			ok( typeof toss.top === "number", "Top is a number" );			
		});
		
		test( 'Overthrow.toss methods return includes left value', function(){
			var toss = overthrow.toss(testElem);
			ok( toss.left !== undefined, "Left is defined" );			
		});
		
		test( 'Overthrow.toss methods return left value is a number', function(){
			var toss = overthrow.toss(testElem);
			ok( typeof toss.left === "number", "Left is a number" );			
		});
		

		test( "Overthrow.toss returns overridden top absolute value", function(){
			var toss = overthrow.toss( testElem, { top: 500 } );
			ok(  toss.top === 500, "Top equals 500" );	
		});
		
		test( "Overthrow.toss returns expected overridden top relative value", function(){
			testElem.scrollTop = 10;
			var newtop = "+10",
				expected = testElem.scrollTop + 10;
				
			var toss = overthrow.toss( testElem, { top: newtop } );
			ok(  toss.top === expected, "Top returns expected value" );	
		});
		
		test( "Overthrow.toss returns expected overridden left relative value", function(){
			testElem.scrollLeft = 10;
			var newleft = "+10",
				expected = testElem.scrollLeft + 10;
				
			var toss = overthrow.toss( testElem, { left: newleft } );
			ok(  toss.left === expected, "Left returns expected value" );	
		});
		
		test( "Overthrow.toss returns expected overridden top negative relative value", function(){
			testElem.scrollTop = 10;
			var newtop = "-10",
				expected = testElem.scrollTop - 10;
				
			var toss = overthrow.toss( testElem, { top: newtop } );
			ok(  toss.top === expected, "Top returns expected value" );	
		});
		
		test( "Overthrow.toss returns expected overridden left negative relative value", function(){
			testElem.scrollLeft = 10;
			var newleft = "-10",
				expected = testElem.scrollLeft - 10;
				
			var toss = overthrow.toss( testElem, { left: newleft } );
			ok(  toss.left === expected, "Left returns expected value" );	
		});
		
		
		
		
		test( "Overthrow.toss returns overridden left absolute value", function(){
			var toss = overthrow.toss( testElem, { left: 200 } );
			ok(  toss.left === 200, "Left equals 200" );	
		});
		



	
};