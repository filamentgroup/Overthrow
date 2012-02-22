// DEMO scripting
(function(w){
	var doc = w.document,
		o = overthrow;
	// Enhance this page a bit

// add a link to toggle overthrow on/off on the content
if( o.support === "native" || o.support === "polyfilled" ){
	var oToggleLink = doc.createElement( "a" ),
		toggleContain = doc.getElementById( "toggleContain" );

	if( toggleContain ){	
		oToggleLink.href = "#";
		oToggleLink.className = "toggle";
		oToggleLink.innerHTML = "Disable Overthrow";
		oToggleLink.onclick = function( e ){
			if( doc.documentElement.className.indexOf( "overthrow" ) > -1 ){
				o.forget();
				oToggleLink.innerText = "Enable Overthrow";
			}
			else{
				o.set();
				oToggleLink.innerText = "Disable Overthrow";
			}
			e.preventDefault();
		};
	
		doc.getElementById( "toggleContain" ).appendChild( oToggleLink );
	}
}

})(this);