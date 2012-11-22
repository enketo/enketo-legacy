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

var CACHE_CHECK_INTERVAL = 360*1000; //CHANGE TO 3600*1000

/**
 * @constructor
 * Function (CLass): Cache
 *
 * description
 *
 * Returns:
 *
 *   return description
 */
function Cache(){
	'use strict';
	//var cacheType, appCache, update, error;
	//var loadedVersion; //only used for Gears cache
}
		
Cache.prototype.init = function(){
	var appCache= window.applicationCache,
		that = this;
	//first check for the preferred cache
	if (!this.isSupported){
		return false;
	}
	if (appCache.status > 0 && appCache.status < 5){
		gui.updateStatus.offlineLaunch(true);
		setTimeout(this.showBookmarkMsg, 5000);
	}
	if (appCache.status === appCache.UPDATEREADY){
		this.onUpdateReady();
	}
	if (appCache.status === appCache.OBSOLETE){
		this.onObsolete();
	}

	//manifest is no longer served (form removed or offline-launch disabled). DOES THIS FIRE IN ALL BROWSERS?
	$(appCache).on('obsolete', function(){that.onObsolete();});
	//applicationCache.addEventListener('obsolete', this.onObsolete, false);

	//the very first time an application cache is saved
	$(appCache).on('cached', function(){that.onCached();});
	//applicationCache.addEventListener('cached', this.onCached, false);

	//when an updated cache is downloaded and ready to be used
	$(appCache).on('updateready', function(){that.onUpdateReady();});
	//applicationCache.addEventListener('updateready', this.onUpdateReady, false);
	
	//when an error occurs (not necessarily serious)
	$(appCache).on('error', function(e){that.onErrors(e);});
	//applicationCache.addEventListener('error', this.onErrors, false);

	setInterval(function(){
		that.update();
		//applicationCache.update();
	}, CACHE_CHECK_INTERVAL);

	//if status is UNCACHED OR IDLE, force an update check
	//if (appCache.status === appCache.UNCACHED || appCache.status === appCache.IDLE){
		//throws expeception in Firefox if user hasn't yet approved the use of the application cache
		//it also doesn't seem necessary in Firefox and Chrome as it happens right away automatically
		//this.update();
	//}
};

Cache.prototype.update = function(){
	window.applicationCache.update();
};

Cache.prototype.onObsolete = function(){
	gui.showFeedback('Application/form is no longer able to launch offline.');
	gui.updateStatus.offlineLaunch(false);
};

Cache.prototype.onCached = function(){
	gui.showFeedback('This form can be loaded and used when you are offline!');
	gui.updateStatus.offlineLaunch(true);
};

Cache.prototype.onUpdateReady = function(){
	applicationCache.swapCache();
	gui.showFeedback("A new version of this application or form has been downloaded. "+
		"Refresh this page to load the updated version.", 20);
};

Cache.prototype.onErrors = function(e){
	if (connection.currentOnlineStatus === true){
		console.debug(e);
		console.error('HTML5 cache error event'); // DEBUG
		gui.showFeedback('There is a new version of this application or form available but an error occurs when'+
			' trying to download it. Please try to refresh the page or send a bug report.');
		//gui.updateStatus.offlineLaunch(false);
		//gui.alert('Application error (manifest error). Try to submit or export any locally saved data. Please report to formhub mentioning the url.');
		// Possible to trigger cache problem for testing? ->
		// 1. going offline, 2.manifest with unavailable resource, 3. manifest syntax error
	}
};

Cache.prototype.showBookmarkMsg = function(){
	var bookmark, shown;//, time;
	//reminder to bookmark page will be shown 3 times
	bookmark = store.getRecord('__bookmark');
	shown = (bookmark) ? bookmark['shown'] : 0;
	if(shown < 3){
		//time = (shown === 1) ? 'time' : 'times';
		gui.showFeedback('We recommend to bookmark this page for easy access when you are not connected to the Internet. ');//+
			//'This reminder will be shown '+(2-shown)+' more '+time+'.', 20);
		shown++;
		store.setRecord('__bookmark', {'shown': shown});
	}
};

//Cache.prototype.activate = function(){
//	if (applicationCache.status > 0){
//		gui.showFeedback('Offline launch is already activated. If it is not working please contact formhub.');
//	}
//	else{
//		gui.confirm('By confirming offline launch functionality will be switched on. The application will automatically refresh.');
//	}
//};//

//Cache.prototype.deActivate = function(){
//	if (applicationCache.status === 0){
//		gui.showFeedback('Offline launch is not active.');
//	}
//	else{
//		gui.confirm('By confirming offline launch functionality will be switched off.');
//	}
//};
	
Cache.prototype.isSupported = function(){
	return (window.applicationCache) ? true : false;
};
	
//Cache.prototype.checkForUpdate = function(){
//	console.log('checking for cache update');
//	try{
//		applicationCache.update();}
//	//Opera throws mysterious INVALID_STATE_ERR
//	catch(e){
//		if (e.name === 'NS_ERROR_DOM_SECURITY_ERR'){ //FF before approving offline use
//			error = 'security';
//		}
//		console.log('error thrown during cache update. error name: '+e.name+'  message: '+e.message);
//	}
//	return;
//};


