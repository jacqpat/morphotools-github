'use strict'

function dvptExportJPG2(cy) {
    let blob = cy.jpg({output: 'blob', bg: 'transparent', 
      full: true, scale: 4, quality: 1});
    let aLink = document.createElement('a');
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);
    aLink.download = `${new Date().getTime()}.jpg`;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
    aLink.click();
}

function testImportJSON(){
  $.getJSON( "JSONfile.json", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      items.push( "<li id='" + key + "'>" + val + "</li>" );
    });
  
    $( "<ul/>", {
      "class": "my-new-list",
      html: items.join( "" )
    }).appendTo( "body" );
  });
}
/*
function testImportJSON(){
  // creates an XMLHttpRequest object:
  var xhttp = new XMLHttpRequest();
  // The onreadystatechange property specifies a function to be executed
  // every time the status of the XMLHttpRequest object changes
  xhttp.onreadystatechange = function() {
    // When readyState property is 4 and the status property is 200, the response is ready
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
        myObject = JSON.parse(this.responseText);
        initCytoscape();
       // The responseText property returns the server response as a text string
       // The text string can be used to update a web page
    }
  };
  xhttp.open("GET", "JSONfile.txt", true);
  xhttp.send();
  console.log("json loaded");
}

function initCytoscape() {
  cytoscape({
    container: document.getElementById('cy'),
    elements: myObject
  });
}*/
