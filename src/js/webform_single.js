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

var /**@type {Form}*/ form;
var /**@type {Connection}*/ connection;
var currentOnlineStatus = false;
var /**@type {FileManager}*/ fileManager;

$( document ).ready( function() {
	'use strict';
	var loadErrors;

	form = new Form( 'form.jr:eq(0)', jrDataStr );
	connection = new Connection();
	loadErrors = form.init();
	if ( loadErrors.length > 0 ) {
		gui.showLoadErrors( loadErrors, 'It is recommended not to use this form for data entry until this is resolved.' );
	}
	connection.init();
	gui.setup();
} );