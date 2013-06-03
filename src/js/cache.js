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

/**
 * Cache Class deals with the HTML5 applicationCache
 * @constructor
 */
function Cache(){
	'use strict';
	this.CACHE_CHECK_INTERVAL = 3600*1000;
}

/**
 * Initializes Cache object
 * @return {boolean} returns false if applicationCache is not supported
 */
Cache.prototype.init = function(){
	var appCache,
		that = this;

	//first check if it is supported
	if (!this.isSupported){
		return false;
	}

	appCache = window.applicationCache;
	//TODO: USE NOUPDATE EVENT INSTEAD!
	/**setTimeout(function(){
		if (appCache.status === 1){
			gui.updateStatus.offlineLaunch(true);
			that.showBookmarkMsg();
		}
	}, 60 * 1000);**/

	if (appCache.status === appCache.UPDATEREADY){
		this.onUpdateReady();
	}
	if (appCache.status === appCache.OBSOLETE){
		this.onObsolete();
	}

	//manifest is no longer served (form removed or offline-launch disabled)
	$(appCache).on('obsolete', function(){that.onObsolete();});

	//the very first time an application cache is saved
	$(appCache).on('cached', function(){that.onCached();});

	//when an updated cache is downloaded and ready to be used
	$(appCache).on('updateready', function(){
		if (appCache.status === appCache.UPDATEREADY){
			that.onUpdateReady();
		}
	});
	
	//when an error occurs (not necessarily serious)
	$(appCache).on('error', function(e){that.onErrors(e);});

	$(appCache).on('noupdate', function(){that.onNoUpdate();});

	setInterval(function(){
		that.update();
		//applicationCache.update();
	}, this.CACHE_CHECK_INTERVAL);

	return true;
};

/**
 * Checks for manifest changes which would trigger an applicationCache update
 */
Cache.prototype.update = function(){
	window.applicationCache.update();
};

/**
 * Handler for cache obsolete event
 */
Cache.prototype.onObsolete = function(){
	store.removeRecord('__bookmark');
	gui.confirm({
		msg: 'Refreshing the page may restore it.',
		heading: 'Offline-disabled.',
		errorMsg: 'Application/form is no longer able to launch offline. '
	},{
		posButton: 'Ok',
		negButton: 'Refresh',
		posAction: function(){},
		negAction: function(){document.location.reload(true);}
	});
	gui.updateStatus.offlineLaunch(false);
};

/**
 * Handler for newly-cached event
 */
Cache.prototype.onCached = function(){
	this.showBookmarkMsg('This form works offline!    ', true);
	gui.updateStatus.offlineLaunch(true);
};

/**
 * Handler for no-update event
 */
Cache.prototype.onNoUpdate = function(){
	this.showBookmarkMsg();
	gui.updateStatus.offlineLaunch(true);
};


/**
 * Handler for cache update-ready event
 */
Cache.prototype.onUpdateReady = function(){
	applicationCache.swapCache();
	gui.feedback("A new version of this application or form has been downloaded. "+
		"Refresh this page to load the updated version.", 20, 'Updated!',  {
			posButton: 'Refresh',
			negButton: 'Cancel',
			posAction: function(){document.location.reload(true);}
		}
	);
};


/*
gui.confirm({
			msg: '<div class="alert alert-success">A new version of this application has been downloaded.</div>'+
				'<br/> Refresh the window to start using it.',
			heading: 'Updated!'
		},{
			posButton: 'Refresh',
			negButton: 'Cancel',
			posAction: function(){document.location.reload(true);}
		});
*/

/**
 * Handler for cache error
 * @param  {*} e jQuery error object
 */
Cache.prototype.onErrors = function(e){
	if (connection.currentOnlineStatus === true && window.applicationCache.status !== window.applicationCache.IDLE){
		console.error('HTML5 cache error event', e);
		gui.alert('There is a new version of this application or form available but an error occurs when'+
			' trying to download it. Please try to refresh the page or send a bug report to '+
			'<a href="mailto:'+settings['supportEmail']+'">'+settings['supportEmail']+'</a>.');
		// Possible to trigger cache problem for testing? ->
		// 1. going offline, 2.manifest with unavailable resource, 3. manifest syntax error
	}
};

/**
 * Shows a bookmark advisory message. The first time this is prepended with an 'Offline-capable!' message
 *
 * @param  {string=} prepend message to prepend to standard bookmark message
 * @param  {boolean=} force   whether to force the message regardless of how many times it has been shown already
 */
Cache.prototype.showBookmarkMsg = function(prepend, force){
	var bookmark, shown;
	prepend = prepend || '';
	force = force || false;
	//reminder to bookmark page will be shown 3 times
	bookmark = store.getRecord('__bookmark');
	shown = (bookmark) ? bookmark['shown'] : 0;
	if(force || shown < 3){
		gui.feedback(prepend+'Bookmark this form for easy '+
			'offline access. ', 15);
			//'This reminder will be shown '+(2-shown)+' more '+time+'.', 20);
		shown++;
		store.setRecord('__bookmark', {'shown': shown});
	}
};

/**
 * check if applicationCache is supported in browser
 * @return {boolean} [description]
 */
Cache.prototype.isSupported = function(){
	return (window.applicationCache) ? true : false;
};
	


