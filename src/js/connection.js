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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global BlobBuilder, vkbeautify, saveAs, gui, jrDataStr, report, Form, store:true, StorageLocal:true, Settings, Modernizr*/


//Class dealing with communication to the server ADD HTML5 VALIDATION and FILE/URL UPLOAD from launch.js
/**
 * @constructor
 *
 * Function: Connection
 *
 * description
 *
 * Returns:
 *
 *   return description
 */
function Connection(){
    "use strict";
    var that=this;
    this.CONNECTION_URL = '/checkforconnection.php';
    this.SUBMISSION_URL = '/data/submission';
    this.GETSURVEYURL_URL = '/api_v1/survey';
    //this.SUBMISSION_TRIES = 2;
    this.currentOnlineStatus = null;
    this.uploadOngoingID = null;
    this.uploadOngoingBatchIndex = null;
    this.uploadResult = {win:[], fail:[]};
    this.uploadQueue = [];
    this.oRosaHelper = new this.ORosaHelper(this);

    this.init = function(){
        //console.log('initializing Connection object');
        this.checkOnlineStatus();
        that = this;
        window.setInterval(function(){
            //console.log('setting status'); //DEBUG
            that.checkOnlineStatus();
            //that.uploadFromStore();
        }, 15*1000);
        //window.addEventListener("offline", function(e){
        //  console.log('offline event detected');
        //  setStatus();
        //}
        //window.addEventListener("online", function(e){
        //  console.log('online event detected');
        //  setStatus();
        //}
        $(window).on('offline online', function(){
            console.log('window network event detected');
            that.setOnlineStatus(that.getOnlineStatus());
        });
        //since network change events are not properly fired, at least not in Firefox 13 (OS X), this is an temporary fix
        //that can be removed eventually or set to to 60x1000 (1 min)
        /*window.setInterval(function(){
            $(window).trigger('online');
        }, 10*1000);*/
        $(window).trigger('online');
    };
}

Connection.prototype.checkOnlineStatus = function(){
    var online,
        that = this;
    //console.log('checking connection status');
    //navigator.onLine is totally unreliable (returns incorrect trues) on Firefox, Chrome, Safari (on OS X 10.8),
    //but I assume falses are correct
    if (navigator.onLine){
        if (!this.uploadOngoingID){
            $.ajax({
                type:'GET',
                url: this.CONNECTION_URL,
                cache: false,
                dataType: 'json',
                timeout: 3000,
                complete: function(response){
                    //important to check for the content of the no-cache response as it will
                    //start receiving the fallback page specified in the manifest!
                    online = typeof response.responseText !== 'undefined' && response.responseText === 'connected';
                    that.setOnlineStatus(online);
                }
            });
        }
    }
    else {
        this.setOnlineStatus(false);
    }
};

/**
 * provides the connection status, should be considered: 'seems online' or 'seems offline'
 * NEEDS IMPROVEMENT. navigator.onLine alone is probably not appropriate because for some browsers this will
 * return true when connected to a local network that is not connected to the Internet.
 * However, this could be the first step. If (true) a request is sent to the server to check for a connection
 *
 * @return {?boolean} true if it seems the browser is online, false if it does not, null if not known
 */
Connection.prototype.getOnlineStatus = function(){
    //return navigator.onLine;
    return this.currentOnlineStatus;
};

Connection.prototype.setOnlineStatus = function(newStatus){
    //var oldStatus = onlineStatus;
    //onlineStatus = online;
    if (newStatus !== this.currentOnlineStatus){
        console.log('online status changed to: '+newStatus+', triggering window.onlinestatuschange');
        $(window).trigger('onlinestatuschange', newStatus);
    }
    this.currentOnlineStatus = newStatus;
};

Connection.prototype.cancelSubmissionProcess = function(){
    this.uploadOngoingID = null;
    this.uploadOngoingBatchIndex = null;
    this.uploadResult = {win:[], fail:[]};
    this.uploadQueue = [];
};

/**
 * [uploadRecords description]
 * @param  {{name: string, instanceID: string, formData: FormData, batches: number, batchIndex: number}}    record   [description]
 * @param  {boolean=}                                                   force     [description]
 * @param  {Object.<string, Function>=}                             callbacks only used for testing
 * @return {boolean}           [description]
 */
Connection.prototype.uploadRecords = function(record, force, callbacks){
    var sameItemInQueue, sameItemSubmitted, sameItemOngoing;
    force = force || false;
    callbacks = callbacks || null;

    if (!record.name || !record.instanceID || !record.formData || !record.batches || typeof record.batchIndex == 'undefined'){
        return false;
    }
    sameItemInQueue = $.grep(this.uploadQueue, function(item){
        return (record.instanceID === item.instanceID && record.batchIndex === item.batchIndex);
    });
    sameItemSubmitted = $.grep(this.uploadResult.win, function(item){
        return (record.instanceID === item.instanceID && record.batchIndex === item.batchIndex);
    });
    sameItemOngoing = (this.uploadOngoingID === record.instanceID && this.uploadOngoingBatchIndex === record.batchIndex);
    if (sameItemInQueue.length === 0 && sameItemSubmitted.length === 0 && !sameItemOngoing){
        record.forced = force;
        //TODO ADD CALLBACKS TO EACH RECORD??
        this.uploadQueue.push(record);
        if (!this.uploadOngoingID){
            this.uploadResult = {win:[], fail:[]};
            this.uploadBatchesResult = {};
            this.uploadOne(callbacks);
        }
    }
    //override force property
    //this caters to a situation where the record is already in a queue through automatic uploads, 
    //but the user orders a forced upload
    else{
        sameItemInQueue.forced = force;
    }
    return true;
};

/**
 * Uploads a record from the queue
 * @param  {Object.<string, Function>=} callbacks [description]
 */
Connection.prototype.uploadOne = function(callbacks){//dataXMLStr, name, last){
    var record, content, last, props,
        that = this;

    callbacks = (typeof callbacks === 'undefined' || !callbacks) ? {
        complete: function(jqXHR, response){
            $(document).trigger('submissioncomplete');
            that.processOpenRosaResponse(jqXHR.status, 
                props = {
                    name: record.name,
                    instanceID: record.instanceID,
                    batches: record.batches,
                    batchIndex: record.batchIndex,
                    forced: record.forced
                });
            /**
              * ODK Aggregrate gets very confused if two POSTs are sent in quick succession,
              * as it duplicates 1 entry and omits the other but returns 201 for both...
              * so we wait for the previous POST to finish before sending the next
              */
            that.uploadOne();
        },
        error: function(jqXHR, textStatus){
            if (textStatus === 'timeout'){
                console.debug('submission request timed out');
            }
            else{
                console.error('error during submission, textStatus:', textStatus);
            }
        },
        success: function(){}
    } : callbacks;

    if (this.uploadQueue.length > 0){
        record = this.uploadQueue.pop();
        if (this.currentOnlineStatus === false){
            this.processOpenRosaResponse(0, record);
        }
        else{
            this.uploadOngoingID = record.instanceID;
            this.uploadOngoingBatchIndex = record.batchIndex;
            content = record.formData;
            content.append('Date', new Date().toUTCString());
            console.debug('prepared to send: ', content);
            //last = (this.uploadQueue.length === 0) ? true : false;
            this.setOnlineStatus(null);
            $(document).trigger('submissionstart');
            //console.debug('calbacks: ', callbacks );
            $.ajax(this.SUBMISSION_URL,{
                type: 'POST',
                data: content,
                cache: false,
                contentType: false,
                processData: false,
                //TIMEOUT TO BE TESTED WITH LARGE SIZE PAYLOADS AND SLOW CONNECTIONS...
                timeout: 300*1000,
                //beforeSend: function(){return false;},
                complete: function(jqXHR, response){
                    that.uploadOngoingID = null;
                    that.uploadOngoingBatchIndex = null;
                    callbacks.complete(jqXHR, response);
                },
                error: callbacks.error,
                success: callbacks.success
            });
        }
    }
};

//TODO: move this outside this class?
/**
 * processes the OpenRosa response
 * @param  {number} status [description]
 * @param  {{name:string, instanceID:string, batches:number, batchIndex:number, forced:boolean}} props  record properties
 */
Connection.prototype.processOpenRosaResponse = function(status, props){
    var i, waswere, name, namesStr, batchText, partial,
        msg = '',
        names=[],
        contactSupport = 'Contact '+settings['supportEmail']+' please.',
        contactAdmin = 'Contact the survey administrator please.',
        serverDown = 'Sorry, the enketo or formhub server is down. Please try again later or contact '+settings['supportEmail']+' please.',
        statusMap = {
            0: {success: false, msg: (typeof jrDataStrToEdit !== 'undefined') ?
                "Uploading of data failed. Please try again." :
                "Uploading of data failed (maybe offline) and will be tried again later." },
            200: {success:false, msg: "Data server did not accept data. "+contactSupport},
            201: {success:true, msg: ""},
            202: {success:true, msg: ""},
            '2xx': {success:false, msg: "Unknown error occurred when submitting data. "+contactSupport},
            400: {success:false, msg: "Data server did not accept data. "+contactAdmin},
            403: {success:false, msg: "You are not allowed to post data to this data server. "+contactAdmin},
            404: {success:false, msg: "Submission service on data server not found or not properly configured."},
            '4xx': {success:false, msg: "Unknown submission problem on data server."},
            413: {success:false, msg: "Data is too large. Please contact "+settings['supportEmail']+"."},
            500: {success:false, msg: serverDown},
            503: {success:false, msg: serverDown},
            '5xx':{success:false, msg: serverDown}
        };

    console.debug('submission results with status: '+status+' for ', props);

    batchText = (props.batches > 1) ? ' (batch #'+(props.batchIndex + 1)+' out of '+props.batches+')' : '';
    props.batchText = batchText;
    
    if (typeof statusMap[status] !== 'undefined'){
        props.msg = statusMap[status].msg;
        if ( statusMap[status].success === true){
            if (props.batches > 1) {
                if (typeof this.uploadBatchesResult[props.instanceID] == 'undefined'){
                    this.uploadBatchesResult[props.instanceID] = [];
                }
                this.uploadBatchesResult[props.instanceID].push(props.batchIndex);
                for (i = 0 ; i < props.batches ; i++){
                    if ($.inArray(i, this.uploadBatchesResult[props.instanceID]) === -1){
                        partial = true;
                    }
                }
            }
            if (!partial){
                $(document).trigger('submissionsuccess', [props.name, props.instanceID]);
            }
            else{
                console.debug('not all batches for instanceID have been submitted, current queue:', this.uploadQueue);
            }
            this.uploadResult.win.push(props);
        }
        else if (statusMap[status].success === false){
            this.uploadResult.fail.push(props);
        }
    }
    else if (status == 401){
        this.cancelSubmissionProcess();
        gui.confirmLogin();
    }
    //unforeseen statuscodes
    else if (status > 500){
        console.error ('Error during uploading, received unexpected statuscode: '+status);
        props.msg = statusMap['5xx'].msg;
        this.uploadResult.fail.push(props);
    }
    else if (status > 400){
        console.error ('Error during uploading, received unexpected statuscode: '+status);
        props.msg = statusMap['4xx'].msg;
        this.uploadResult.fail.push(props);
    }
    else if (status > 200){
        console.error ('Error during uploading, received unexpected statuscode: '+status);
        props.msg = statusMap['2xx'].msg;
        this.uploadResult.fail.push(props);
    }   

    if (this.uploadQueue.length > 0){
        return;
    }

    console.debug('online: '+this.currentOnlineStatus, this.uploadResult);

    if (this.uploadResult.win.length > 0){
        for (i = 0 ; i<this.uploadResult.win.length ; i++){
            name = this.uploadResult.win[i].name;
            if ($.inArray(name, names) === -1) {
                names.push(name);
                msg = (typeof this.uploadResult.win[i].msg !== 'undefined') ? msg + (this.uploadResult.win[i].msg)+' ' : '';
            }
        }
        waswere = (names.length > 1) ? ' were' : ' was';
        namesStr = names.join(', ');
        gui.feedback(namesStr.substring(0, namesStr.length) + waswere +' successfully uploaded. '+msg);
        this.setOnlineStatus(true);
    }

    if (this.uploadResult.fail.length > 0){
        msg = '';
        //console.debug('upload failed');
        if (this.currentOnlineStatus !== false){
            for (i = 0 ; i<this.uploadResult.fail.length ; i++){
                //if the record upload was forced
                if(this.uploadResult.fail[i].forced){
                    msg += this.uploadResult.fail[i].name +this.uploadResult.fail[i].batchText + ': ' + this.uploadResult.fail[i].msg + '<br />';
                }
            }
            if (msg) gui.alert(msg, 'Failed data submission');
        }
        else{
            // not sure if there should be any notification if forms fail automatic submission when offline
        }
        //this is actually not correct as there could be many reasons for uploads to fail, but let's use it for now.
        this.setOnlineStatus(false);
    }
};

/**
 * returns the value of the X-OpenRosa-Content-Length header return by the OpenRosa server for this form
 * if request fails, returns a default value. Won't execute again if request was successful.
 * 
 * @return {number} [description]
 */
Connection.prototype.maxSubmissionSize = function(){
    var maxSize,
        defaultMax = 5000000,
        absoluteMax = 100 * 1024 * 1024,
        that = this;
    if (typeof this.maxSize == 'undefined' && !this.maxSize){
        $.ajax('/data/max_size', {
            type: 'GET',
            async: false,
            timeout: 5*1000,
            success: function(response){
                maxSize = parseInt(response, 10) || defaultMax;
                //setting an absolute max as defined in enketo .htaccess file
                maxSize = (maxSize > absoluteMax) ? absoluteMax : maxSize;
                that.maxSize = maxSize;
            },
            error: function(){
                maxSize = defaultMax;
            }
        });
        return maxSize;
    }
    return this.maxSize;
};

Connection.prototype.isValidURL = function(url){
    return (/^(https?:\/\/)(([\da-z\.\-]+)\.([a-z\.]{2,6})|(([0-9]{1,3}\.){3}[0-9]{1,3}))([\/\w \.\-]*)*\/?[\/\w \.\-\=\&\?]*$/).test(url);
};

Connection.prototype.getFormlist = function(serverURL, callbacks){
    callbacks = this.getCallbacks(callbacks);

    if (!this.isValidURL(serverURL)){
        callbacks.error(null, 'validationerror', 'not a valid URL');
        return;
    }
    $.ajax('/forms/get_list', {
        type: 'GET',
        data: {server_url: serverURL},
        cache: false,
        contentType: 'json',
        timeout: 60*1000,
        success: callbacks.success,
        error: callbacks.error,
        complete: callbacks.complete
    });
};

Connection.prototype.getSurveyURL = function(serverURL, formId, callbacks){
    callbacks = this.getCallbacks(callbacks);

    if (!serverURL || !this.isValidURL(serverURL)){
        callbacks.error(null, 'validationerror', 'not a valid server URL');
        return;
    }
    if (!formId || formId.length === 0){
        callbacks.error(null, 'validationerror', 'not a valid formId');
        return;
    }
    $.ajax({
        url: this.GETSURVEYURL_URL,
        type: 'POST',
        data: {server_url: serverURL, form_id: formId},
        cache: false,
        timeout: 60*1000,
        dataType: 'json',
        success: callbacks.success,
        error: callbacks.error,
        complete: callbacks.complete
    });
};

/**
 * Obtains HTML Form from an XML file or from a server url and form id
 * @param  {?string=}                   serverURL   full server URL
 * @param  {?string=}                   formId      form ID
 * @param  {Blob=}                      formFile    XForm XML file
 * @param  {?string=}                   formURL     XForm URL
 * @param  {Object.<string, Function>=} callbacks   callbacks
 */
Connection.prototype.getTransForm = function(serverURL, formId, formFile, formURL, callbacks){
    var formData = new FormData();

    callbacks = this.getCallbacks(callbacks);
    serverURL = serverURL || null;
    formId = formId || null;
    formURL = formURL || null;
    formFile = formFile || new Blob();

    if (formFile.size === 0 && (!serverURL || !formId) && !formURL ){
        callbacks.error(null, 'validationerror', 'No form file or URLs provided');
        return;
    }
    if (formFile.size === 0 && !this.isValidURL(serverURL) && !this.isValidURL(formURL)){
        callbacks.error(null, 'validationerror', 'Not a valid server or form url');
        return;
    }
    if (formFile.size === 0 && !formURL && (!formId || formId.length === 0)){
        callbacks.error(null, 'validationerror', 'No form id provided');
        return;
    }
    //don't append if null, as FF turns null into 'null'
    if (serverURL) formData.append('server_url', serverURL);
    if (formId) formData.append('form_id', formId);
    if (formURL) formData.append('form_url', formURL);
    if (formFile) formData.append('xml_file', formFile);

    console.debug('form file: ', formFile);

    $.ajax('/transform/get_html_form', {
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'xml',
        data: formData,
        success: callbacks.success,
        error: callbacks.error,
        complete: callbacks.complete
    });
};

Connection.prototype.validateHTML = function(htmlStr, callbacks){
    var content = new FormData();

    callbacks = this.getCallbacks(callbacks);

    content.append('level', 'error');
    content.append('content', htmlStr);

    $.ajax('/html5validate/', {
        type: 'POST',
        data: content,
        contentType: false,
        processData: false,
        success: callbacks.success,
        error: callbacks.error,
        complete: callbacks.complete
    });
};

/**
 * Collection of helper functions for openRosa connectivity
 * @param {*} conn [description]
 * @constructor
 */
Connection.prototype.ORosaHelper = function(conn){
    /**
     * Magically generates a well-formed serverURL from a type and fragment
     * @param  {string} type    type of server or account (http, https, formhub_uni, formhub, appspot)
     * @param  {string} frag    a user input for the given type
     * @return {?string}        a full serverURL
     */
    this.fragToServerURL = function(type, frag){
        var protocol,
            serverURL = '';

        if (!frag){
            console.log('nothing to do');
            return null;
        }
        console.debug('frag: '+frag);
        //always override if valid URL is entered
        //TODO: REMOVE reference to connection
        if (conn.isValidURL(frag)){
            return frag;
        }

        switch (type){
            case 'http':
            case 'https':
                protocol = (/^http(|s):\/\//.test(frag)) ? '' : type+'://';
                serverURL = protocol + frag;
                break;
            case 'formhub_uni':
            case 'formhub':
                serverURL = 'https://formhub.org/'+frag;
                break;
            case 'appspot':
                serverURL = 'https://'+frag+'.appspot.com';
                break;
        }

        if (!conn.isValidURL(serverURL)){
            console.error('not a valid url: '+serverURL);
            return null;
        }
        console.log('server_url: '+serverURL);
        return serverURL;
    };
};

/**
 * Get the number of forms launched on enketo (all know deployments)
 * @param  {Object.<string, Function>=} callbacks callbacks
 */
Connection.prototype.getNumberFormsLaunched = function(callbacks){
    callbacks = this.getCallbacks(callbacks);
    $.ajax({
        url: '/front/get_number_launched_everywhere',
        dataType: 'json',
        success: callbacks.success,
        error: callbacks.error,
        complete: callbacks.complete
    });
};

/**
 * Loads a google maps API v3 script
 * @param  {Function} callback function to call when script has been loaded and added to DOM
 */
Connection.prototype.loadGoogleMaps = function(callback){
    var APIKey = settings['mapsDynamicAPIKey'] || '',
        script = document.createElement("script");
    window.googleMapsInit = callback;
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&key="+APIKey+"&sensor=false&libraries=places&callback=googleMapsInit";
    document.body.appendChild(script);
};

/**
 * Sets defaults for optional callbacks if not provided
 * @param  {Object.<string, Function>=} callbacks [description]
 * @return {Object.<string, Function>}           [description]
 */
Connection.prototype.getCallbacks = function(callbacks){
    callbacks = callbacks || {};
    callbacks.error = callbacks.error || function(jqXHR, textStatus, errorThrown){
        console.error(textStatus+' : '+errorThrown);
    };
    callbacks.complete = callbacks.complete || function(){};
    callbacks.success = callbacks.success || function(){console.log('success!');};
    return callbacks;
};