(function( $ ){

  var methods = {
    init : function( options ) { 
      // THIS 
    },
    getHTMLForm : function( ) {
      // IS
    },
    getData : function( ) { 
      // GOOD
    },
    setData : function( data ) { 
      // !!! 
    }
  };

  $.fn.xform = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };

})( jQuery );

// calls the init method
$('form').xform('getHTMLForm', XFormString); 

// calls the init method
$('div').tooltip({
  foo : 'bar'
});