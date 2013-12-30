if ( typeof define !== 'function' ) {
    var define = require( 'amdefine' )( module );
}

define( [ "store" ], function( store ) {

    describe( "Local record storage", function() {
        var record;

        beforeEach( function() {
            record = {
                data: 'bla'
            };
        } );

        afterEach( function() {
            localStorage.clear();
        } );

        it( 'is supported in this browser', function() {
            expect( store.isSupported() ).toEqual( true );
        } );

        describe( 'attempt to save records', function() {
            var i, name = 'myname',
                otherName = 'anothername',
                testKey = function( key, expectedResp ) {
                    it( 'fail if record name: ' + key + ' is provided and returns "' + expectedResp + '"', function() {
                        expect( store.setRecord( key, record ) ).toEqual( expectedResp );
                    } );
                },
                emptyKeys = [ null, false, true, {},
                    [], '', undefined
                ],
                forbiddenKeys = [ '__settings', 'null', '__history', 'Firebug', 'undefined', '__bookmark', '__counter', '__current_server' ];

            for ( i = 0; i < emptyKeys.length; i++ ) {
                testKey( emptyKeys[ i ], 'require' );
            }
            for ( i = 0; i < forbiddenKeys.length; i++ ) {
                testKey( forbiddenKeys[ i ], 'forbidden' );
            }

            it( 'fail if there is already a record with that name and the overwrite parameter is not true', function() {
                expect( store.setRecord( name, record ) ).toEqual( 'success' );
                expect( store.setRecord( name, record ) ).toEqual( 'existing' );
                expect( store.setRecord( name, record, null, null, name ) ).toEqual( 'existing' );
                expect( store.setRecord( name, record, null, false, name ) ).toEqual( 'existing' );
                expect( store.setRecord( name, record, null, null, otherName ) ).toEqual( 'existing' );
                expect( store.setRecord( name, record, null, false, otherName ) ).toEqual( 'existing' );
            } );

            it( 'succeed if the record name already exists but the overwrite parameter is set to true', function() {
                expect( store.setRecord( name, record ) ).toEqual( 'success' );
                expect( store.setRecord( name, record, null, true, name ) ).toEqual( 'success' );
                expect( store.setRecord( name, record, null, true, otherName ) ).toEqual( 'success' );
            } );

            it( 'remove the old record when a record is saved under a new name and the del parameter is true', function() {
                expect( store.setRecord( name, record ) ).toEqual( 'success' );
                expect( store.getRecord( name ).data ).toEqual( record.data );
            } );

        } );

        describe( 'storage space limit', function() {
            var dataCharsStored = 0,
                str = 'dsbaadbcdd',
                result,
                i, j;

            it( 'is at least 5Mb', function() {
                for ( i = 0; i < 1000; i++ ) {
                    record.data += str;
                }
                for ( j = 0; j < 10000; j++ ) {
                    var key = j.toString();
                    result = store.setRecord( key, record );
                    if ( result === 'success' ) {
                        var storedRecord = store.getRecord( key );
                        if ( storedRecord ) {
                            dataCharsStored += JSON.stringify( storedRecord ).length + key.length;
                        } else {
                            console.error( 'could not retrieve stored record' );
                            break;
                        }
                    } else break;
                }
                //1 character in javascript takes up 2 bytes. To cater to some storage overhead 1024 is rounded down to 1000
                //Note: FF does not even reach the limit at 200 Mb.
                expect( dataCharsStored ).toBeGreaterThan( 5 * 1000 * 1000 / 2 );
                //expect(dataCharsStored).toEqual(-1);
            } );

            it( 'when exceeded during saving a record, returns "full", otherwise "success"', function() {
                expect( ( j < 10000 && result.substring( 0, 4 ) === 'full' ) || ( j === 10000 && result === 'success' ) ).toBe( true );
            } );
        } );

        describe( 'attemps to load a record', function() {
            var retrievedRecord;
            it( 'return the record as an object when it is available', function() {
                var recordName = 'a';
                store.setRecord( recordName, record );
                retrievedRecord = store.getRecord( recordName );
                expect( typeof retrievedRecord ).toEqual( 'object' );
                expect( retrievedRecord.data ).toEqual( 'bla' );
            } );
            it( 'return null when the record does not exist', function() {
                retrievedRecord = store.getRecord( 'b' );
                expect( retrievedRecord ).toEqual( null );
            } );
        } );

        describe( 'attempts to remove a record', function() {
            it( 'succeed if the record exists', function() {
                var recordName = 'c';
                store.setRecord( recordName, record );
                expect( store.getRecord( recordName ).data ).toEqual( 'bla' );
                store.removeRecord( recordName );
                expect( store.getRecord( recordName ) ).toEqual( null );
            } );
            //how to make this fail?
        } );

        describe( 'obtaining lists of records', function() {

            beforeEach( function() {
                for ( var i = 0; i < 10; i++ ) {
                    var result = store.setRecord( i.toString(), {
                        data: '<data></data>',
                        draft: !( i % 2 )
                    } );

                    console.log( 'setting record with draft', !( i % 2 ), result );
                }
            } );

            afterEach( function() {
                for ( var i = 0; i < 10; i++ ) {
                    store.removeRecord( i );
                }
            } );

            it( 'as an array of record names with draft and lastSaved properties return correct list size', function() {
                expect( store.getRecordList().length ).toEqual( 10 );
            } );

            it( 'as an array of complete records returns the expect number', function() {
                // all records
                expect( store.getSurveyRecords( false ).length ).toEqual( 10 );
                // only records not marked as draft
                expect( store.getSurveyRecords( true ).length ).toEqual( 5 );
                // all records excluding record '5'
                expect( store.getSurveyRecords( false, '5' ).length ).toEqual( 9 );
                // all final records excluding record '5'
                expect( store.getSurveyRecords( true, '5' ).length ).toEqual( 4 );
            } );

            it( 'exports all records to a valid XML string that includes all records', function() {
                var exportedXML = $.parseXML( '<root>' + store.getExportStr() + '</root>' );
                expect( exportedXML ).toBeTruthy();
                expect( $( exportedXML ).find( 'record' ).length ).toEqual( 10 );
            } );

            it( 'includes the draft="true()" property in exported records when applicable', function() {
                var exportedXML = $.parseXML( '<root>' + store.getExportStr() + '</root>' );
                expect( $( exportedXML ).find( 'record[draft="true()"]' ).length ).toEqual( 5 );
            } );

            it( 'includes a populated lastSaved property in all exported records', function() {
                var exportedXML = $.parseXML( '<root>' + store.getExportStr() + '</root>' );
                expect( $( exportedXML ).find( 'record[lastSaved!=""]' ).length ).toEqual( 10 );
            } );
        } );
    } );
} );
