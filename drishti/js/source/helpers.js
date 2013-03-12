/**
 * Pads a string with prefixed zeros until the requested string length is achieved.
 * @param  {number} digits [description]
 * @return {String|string}        [description]
 */
String.prototype.pad = function(digits){
	var x = this;
	while (x.length < digits){
		x = '0'+x;
	}
	return x;
};

var profilerRecords = [];

/**
 * Little profiling object
 * @param {string} taskName [description]
 * @constructor
 */
function Profiler(taskName){
	var start = new Date().getTime();
	/**
	 * @param  {string=} message [description]
	 */
	this.report = function(message){
		message = message || 'time taken for '+taskName+' to execute in milliseconds: '+ (new Date().getTime() - start);
		//console.error(message);
		profilerRecords.push(message);
	};
}

window.onload = function(){
	setTimeout(function(){
		var loadLog,
			t = window.performance.timing,
			loadingTime = t.loadEventEnd - t.responseEnd,
			exLog = /**@type {string} */window.localStorage.getItem('__loadLog');
		if (settings.debug){
			loadLog = (exLog) ? JSON.parse(exLog) : [];
			loadLog.push(loadingTime);
			if (loadLog.length > 10){
				loadLog.shift();
			}
			window.localStorage.setItem('__loadLog', JSON.stringify(loadLog));
		}
		profilerRecords.push('total loading time: '+ loadingTime);
		if (window.opener) window.opener.postMessage(JSON.stringify(window.performance), '*');
		$(profilerRecords).each(function(i,v){console.log(v);});
	}, 0);
};

(function($){
	"use strict";
	// give a set of elements the same (longest) width
	$.fn.toLargestWidth = function(){
		var largestWidth = 0;
		return this.each(function(){
			if ($(this).width() > largestWidth) {
				largestWidth = $(this).width();
			}
		}).each(function(){
			$(this).width(largestWidth);
		});
	};

	$.fn.toSmallestWidth = function(){
		var smallestWidth = 2000;
		return this.each(function(){
			if ($(this).width() < smallestWidth) {
				smallestWidth = $(this).width();
			}
		}).each(function(){
			$(this).width(smallestWidth);
		});
	};

	//reverse jQuery collection
	$.fn.reverse = [].reverse;

	// Alphanumeric plugin for form input elements see http://www.itgroup.com.ph/alphanumeric/
	$.fn.alphanumeric = function(p) {

		p = $.extend({
			ichars: "!@#$%^&*()+=[]\\\';,/{}|\":<>?~`.- ",
			nchars: "",
			allow: ""
		}, p);

		return this.each(function(){

			if (p.nocaps) p.nchars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			if (p.allcaps) p.nchars += "abcdefghijklmnopqrstuvwxyz";

			var s = p.allow.split('');
			for (var i=0;i<s.length;i++) if (p.ichars.indexOf(s[i]) != -1) s[i] = "\\" + s[i];
			p.allow = s.join('|');

			var reg = new RegExp(p.allow,'gi');
			var ch = p.ichars + p.nchars;
			ch = ch.replace(reg,'');

			$(this).keypress
				(
					function (e)
						{
							var k;
							if (!e.charCode) k = String.fromCharCode(e.which);
								else k = String.fromCharCode(e.charCode);

							if (ch.indexOf(k) != -1) e.preventDefault();
							if (e.ctrlKey&&k=='v') e.preventDefault();

						}

				);

			$(this).bind('contextmenu',function () {return false;});
		});
	};

	$.fn.numeric = function(p) {

		var az = "abcdefghijklmnopqrstuvwxyz";
		az += az.toUpperCase();

		p = $.extend({
			nchars: az
		}, p);

		return this.each (function()
			{
				$(this).alphanumeric(p);
			}
		);

	};

	$.fn.alpha = function(p) {

		var nm = "1234567890";

		p = $.extend({
			nchars: nm
		}, p);

		return this.each (function()
			{
				$(this).alphanumeric(p);
			}
		);

	};

	// plugin to select the first word(s) of a string and capitalize it
	$.fn.capitalizeStart = function (numWords) {
		if(!numWords){
			numWords = 1;
		}
		var node = this.contents().filter(function () {
			return this.nodeType == 3;
			}).first(),
			text = node.text(),
			first = text.split(" ", numWords).join(" ");

		if (!node.length)
			return;

		node[0].nodeValue = text.slice(first.length);
		node.before('<span class="capitalize">' + first + '</span>');
	};


})(jQuery);