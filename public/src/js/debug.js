/**
 * @preserve Copyright 2012 Martijn van de Rijdt
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$( document ).ready( function() {
    setDebugEventHandlers();
} );

// clear local storage

function cls() {
    localStorage.clear();
}

//show Feedback bar

function sf( msg ) {
    if ( !msg ) msg = 'test feedback message';
    gui.showFeedback( msg, 5000 );
}

//show Dialog

function sd( msg ) {
    if ( !msg ) msg = 'test dialog message';
    gui.alert( msg );
}

function setDebugEventHandlers() {
    var i, el, elDOM, ev,
        events = {
            'doc': [ 'submissionstart', 'submissioncomplete', 'submissionsuccess' ]
        };
    for ( el in events ) {
        elDOM = ( el === 'doc' ) ? document : ( el === 'win' ) ? window : el;
        for ( i = 0; i < events[ el ].length; i++ ) {
            ev = events[ el ][ i ];
            $( elDOM ).on( ev, handler ); //function(e, a, b, c){
        }
    }

    function handler( e, a, b ) {
        console.log( e.type + ' event was triggered with param: ' + a, b, e );
    }
}

// helper function to set up and close test by removing and returning all survey data in localStorage

/**
 * @constructor
 * Function: StoredData
 *
 * description
 *
 * Returns:
 *
 *   return description
 */

function StoredData() {
    var data = [];

    this.remove = function() {
        dataTypes = [ 'surveyData', 'settings' ];
        for ( var j in dataTypes ) {
            data[ j ] = store.getRecordCollection( dataTypes[ j ] );
            for ( var i in data[ j ] ) {
                if ( data[ j ][ i ].recordType === dataTypes[ j ] ) { //double check
                    //console.log('going to remove: '+JSON.stringify(data[j][i])); // DEBUG
                    localStorage.removeItem( data[ j ][ i ].key ); // the actual localStorage key is used (more robust)
                }
            }
        }
    };

    this.putBack = function() {
        for ( var j in data ) {
            for ( var i in data[ j ] ) {
                //console.log('going to put back: '+JSON.stringify(data[j][i])); // DEBUG
                localStorage.setItem( data[ j ][ i ].key, JSON.stringify( data[ j ][ i ] ) );
            }
        }
    };
}

// helper function to enter data for testing

function getRandomString( length ) {
    var chars = "   0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    if ( !length ) {
        length = 8;
    }
    var randomstring = '';
    for ( var i = 0; i < length; i++ ) {
        var rnum = Math.floor( Math.random() * chars.length );
        randomstring += chars.substring( rnum, rnum + 1 );
    }
    return randomstring;
}
