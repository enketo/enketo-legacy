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


define( [], function() {
    "use strict";
    var i, queryParam,
        evaluatedSettings = [],
        settingsMap = [ {
            q: 'return',
            s: 'returnURL'
        }, {
            q: 'showbranch',
            s: 'showBranch'
        }, {
            q: 'debug',
            s: 'debug'
        }, {
            q: 'touch',
            s: 'touch'
        }, {
            q: 'server',
            s: 'serverURL'
        }, {
            q: 'form',
            s: 'formURL'
        }, {
            q: 'id',
            s: 'formId'
        }, {
            q: 'formName',
            s: 'formId'
        }, {
            q: 'instanceId',
            s: 'instanceId'
        }, {
            q: 'entityId',
            s: 'entityId'
        }, {
            q: 'supportEmail',
            s: 'supportEmail'
        } ];
    for ( i = 0; i < settingsMap.length; i++ ) {
        queryParam = getQueryParam( settingsMap[ i ].q );
        //a query variable has preference
        evaluatedSettings[ settingsMap[ i ].s ] = ( queryParam !== null ) ?
            queryParam : ( typeof settings[ settingsMap[ i ].s ] !== 'undefined' ) ? settings[ settingsMap[ i ].s ] : null;
    }
    console.log( 'the settings were set', evaluatedSettings );

    function getQueryParam( param ) {
        var allParams = getAllQueryParams();
        for ( var paramName in allParams ) {
            if ( paramName.toLowerCase() === param.toLowerCase() ) {
                return allParams[ paramName ];
            }
        }
        return null;
    }

    function getAllQueryParams() {
        var val, processedVal,
            query = window.location.search.substring( 1 ),
            vars = query.split( "&" ),
            params = {};
        for ( var i = 0; i < vars.length; i++ ) {
            var pair = vars[ i ].split( "=" );
            if ( pair[ 0 ].length > 0 ) {
                val = decodeURIComponent( pair[ 1 ] );
                processedVal = ( val === 'true' ) ? true : ( val === 'false' ) ? false : val;
                params[ pair[ 0 ] ] = processedVal;
            }
        }
        return params;
    }

    return evaluatedSettings;
} );
