/**
 * @preserve Copyright 2013 Martijn van de Rijdt
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

/**
 * Performance monitoring tools
 */

define( [ 'settings' ], function( settings ) {
    var profilerRecords = [];
    var xpathEvalNum = 0,
        xpathEvalTime = 0,
        xpathEvalTimePure = 0;

    /**
     * Little profiler
     * @param {string} taskName [description]
     * @constructor
     */

    //function Profiler( taskName ) {
    //    var start = new Date().getTime();
    //    /**
    //     * @param  {string=} message [description]
    //     */
    //    this.report = function( message ) {
    //        message = message || 'time taken for ' + taskName + ' to execute in milliseconds: ' + ( new Date().getTime() - start );
    //        //console.error(message);
    //        profilerRecords.push( message );
    //    };
    //}

    window.onload = function() {
        setTimeout( function() {
            var loadLog, t, loadingTime, exLog, timingO = {};
            if ( window.performance ) {
                t = window.performance.timing;
                loadingTime = t.loadEventEnd - t.responseEnd;
                if ( typeof settings !== 'undefined' && settings.debug ) {
                    exLog = /**@type {string} */ window.localStorage.getItem( '__loadLog' );
                    loadLog = ( exLog ) ? JSON.parse( exLog ) : [];
                    loadLog.push( loadingTime );
                    if ( loadLog.length > 10 ) {
                        loadLog.shift();
                    }
                    window.localStorage.setItem( '__loadLog', JSON.stringify( loadLog ) );
                }
                profilerRecords.push( 'total loading time: ' + loadingTime + ' milliseconds' );
                //$('.enketo-power').append('<p style="font-size: 0.7em;">(total load: '+loadingTime+' msec, XPath: '+xpathEvalTime+' msec)</p>');
                //FF doesn't allow stringifying native window objects so we create a copy first
                for ( var prop in window.performance.timing ) {
                    timingO[ prop ] = window.performance.timing[ prop ];
                }
                if ( window.opener && window.performance && window.postMessage ) window.opener.postMessage( JSON.stringify( timingO ), '*' );
                $( profilerRecords ).each( function( i, v ) {
                    console.log( v );
                } );
            }
        }, 0 );
    };
} );
