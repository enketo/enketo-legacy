/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modilabs
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

var /**@type {Form}*/ form;
var /**@type {Connection}*/ connection;
var /**@type {FileManager}*/ fileManager;

$( document ).ready( function() {
	'use strict';
	var response, bgColor,
		i = 0,
		$ads = $( '.ad' ),
		$validateButton = $( '#validate-form' ),
		$loading = $( 'progress' );

	if ( ( !settings.serverURL || !settings.formId ) && !settings.formURL ) {
		showError( 'No server url and/or id provided or no form url provided.' );
		return;
	}

	connection = new Connection();
	connection.getTransForm( settings.serverURL, settings.formId, null, settings.formURL, {
		success: function( response ) {
			var loadErrors, formStr, modelStr,
				$response = $( response );

			if ( $response.find( ':first>form' ).length > 0 && $response.find( ':first>model' ).length > 0 ) {
				formStr = new XMLSerializer().serializeToString( $response.find( ':first>form' )[ 0 ] );
				modelStr = new XMLSerializer().serializeToString( $response.find( ':first>model' )[ 0 ] );
				$validateButton.before( formStr );
				form = new Form( 'form.jr:eq(0)', modelStr );
				loadErrors = form.init();
				if ( loadErrors.length > 0 ) {
					gui.showLoadErrors( loadErrors );
				}
				$validateButton.removeAttr( 'disabled' );
			} else {
				showError( 'An error occurred trying to obtain or transform the form.' );
			}
		},
		error: function( jqXHR, status, errorThrown ) {
			if ( jqXHR && jqXHR.status === 401 ) {
				gui.confirmLogin( '<p>Form is protected and requires authentication.</p><p>Would you like to log in now?</p>' );
			} else {
				showError( 'An error occurred trying to obtain or transform the form (' + errorThrown + ')' );
			}
			$loading.remove();
		},
		complete: function() {
			$loading.remove();
		}
	} );

	gui.setup();
} );

function showError( msg ) {
	$( '#validate-form' ).prev( '.alert' ).remove();
	$( '#validate-form' ).before( '<p class="load-error alert alert-error alert-block">' + msg + '</p>' );
}