if ( typeof define !== 'function' ) {
    var define = require( 'amdefine' )( module );
}

define( [ "controller-webform" ], function( controller ) {

    describe( "Algorithm to split submission in chunks", function() {
        var t = [
            [
                [ 1000000, 2000000, 3000000, 4000000 ],
                [
                    [ 0, 1 ],
                    [ 2 ],
                    [ 3 ]
                ]
            ],
            [
                [ 4000000, 1000000, 2000000, 3000000 ],
                [
                    [ 0, 1 ],
                    [ 2, 3 ]
                ]
            ],
            [
                [ 4000000, 2000000, 2000000, 1000000 ],
                [
                    [ 0, 3 ],
                    [ 1, 2 ]
                ]
            ],
            [
                [ 6000000, 1000000, 2000000, 6000000 ],
                [
                    [ 0 ],
                    [ 1, 2 ],
                    [ 3 ]
                ]
            ],
            [
                [ 1000000, 2000000, 2000000, 3000000 ],
                [
                    [ 0, 1, 2 ],
                    [ 3 ]
                ]
            ],
            [
                [ 1000000, 1000000, 1000000, 1000000 ],
                [
                    [ 0, 1, 2, 3 ]
                ]
            ],
            [
                [ 6000000 ],
                [
                    [ 0 ]
                ]
            ]
        ];

        var testBatchDivision = function( sizes, result ) {
            it( 'works as expected for: ' + JSON.stringify( sizes ), function() {
                expect( JSON.stringify( controller.divideIntoBatches( sizes, 5000001 ) ) ).toEqual( JSON.stringify( result ) );
            } );
        };

        for ( var i = 0; i < t.length; i++ ) {
            testBatchDivision( t[ i ][ 0 ], t[ i ][ 1 ] );
        }
    } );

    //this logic has proved to be impossible to isolate properly
    xdescribe( "record saving logic", function() {
        var sampleRecord = {
            data: "<data>mydata</data>"
        };
        controller.init( '<form class="or"></form>', '<model><instance><data id="data"></data></instance></model>', null, {
            recordStore: {
                setRecord: function() {}
            }
        } );

        beforeEach( function() {
            localStorage.clear();
            spyOn( gui, 'confirm' );
            spyOn( gui, 'alert' );
            spyOn( gui, 'feedback' );
            spyOn( store, 'setRecord' );
            spyOn( controller.submitOneForced );
        } );

        it( 'attempts to save right away if the confirmed parameter is provided', function() {
            controller.saveRecord( 'a name', true );
            expect( store.setRecord ).toHaveBeenCalled();
        } );

    } );

} );
