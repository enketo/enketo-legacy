$( document ).ready( function( ) {
  /* Prototypical inheritance http://javascript.crockford.com/prototypal.html */
  if ( typeof Object.create !== 'function' ) {
    Object.create = function( o ) {
      function F( ) {}
      F.prototype = o;
      return new F( );
    };
  }
} );

/**
 * splits an array of file sizes into batches (for submission) based on a limit
 * @param  {Array.<number>} fileSizes   array of file sizes
 * @param  {number}     limit   limit in byte size of one chunk (can be exceeded for a single item)
 * @return {Array.<Array.<number>>} array of arrays with index, each secondary array of indices represents a batch
 */

function divideIntoBatches( fileSizes, limit ) {
  var i, j, batch, batchSize,
    sizes = [ ],
    batches = [ ];
  //limit = limit || 5 * 1024 * 1024;
  for ( i = 0; i < fileSizes.length; i++ ) {
    sizes.push( {
      'index': i,
      'size': fileSizes[ i ]
    } );
  }
  while ( sizes.length > 0 ) {
    batch = [ sizes[ 0 ].index ];
    batchSize = sizes[ 0 ].size;
    if ( sizes[ 0 ].size < limit ) {
      for ( i = 1; i < sizes.length; i++ ) {
        if ( ( batchSize + sizes[ i ].size ) < limit ) {
          batch.push( sizes[ i ].index );
          batchSize += sizes[ i ].size;
        }
      }
    }
    batches.push( batch );
    for ( i = 0; i < sizes.length; i++ ) {
      for ( j = 0; j < batch.length; j++ ) {
        if ( sizes[ i ].index === batch[ j ] ) {
          sizes.splice( i, 1 );
        }
      }
    }
  }
  return batches;
}