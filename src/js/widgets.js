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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true, trailing:false*//*global Modernizr, google, connection*/




/**
 * Bootstrap Select picker that supports single and multiple selects
 */

(function($) {

    "use strict";

    var Selectpicker = function(element, options, e) {
        if (e ) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.$newElement = null;
        this.selectClass = options.btnStyle || '';
        this.noneSelectedText = options.noneSelectedText || 'None selected';
        this.lengthmax = options.maxlength || 20;
        this.multiple = (typeof this.$element.attr('multiple') !== 'undefined' && this.$element.attr('multiple') !== false);
        this.init();
    };

    Selectpicker.prototype = {

        contructor: Selectpicker,

        init: function (e) {
            this.$element.css('display', 'none');

            var template = this.getTemplate();
            template = this.createLi(template);
            this.$element.after(template);
            this.$newElement = this.$element.next('.bootstrap-select');
            this.$newElement.find('> a').addClass(this.selectClass);
            this.clickListener();
        },

        getTemplate: function() {
            var template =
                "<div class='btn-group bootstrap-select'>" +
                    "<a class='btn dropdown-toggle clearfix' data-toggle='dropdown' href='#''>" +
                        "<span class='filter-option pull-left'>__SELECTED_OPTIONS</span>" +
                        "<span class='caret pull-right'></span>" +
                    "</a>" +
                    "<ul class='dropdown-menu' role='menu'>" +
                        "__ADD_LI" +
                    "</ul>" +
                "</div>";

            return template;
        },

        createLi: function(template) {

            var _li = [];
            var _liHtml = '';
            var _inputAttr = (this.multiple) ? "type='checkbox'" : "type='radio' style='display: none;' name='"+Math.random()*100000+"'";
            var _this = this;
            var checkedAttr;

            this.$element.find('option').each(function(){
                _li.push([$(this).text(), $(this).is(':selected')]);
            });

            if(_li.length > 0) {
                template = template.replace('__SELECTED_OPTIONS', this.createSelectedStr());
                for (var i = 0; i < _li.length; i++) {
                    checkedAttr = (_li[i][1]) ? " checked='checked'" : '';
                    _liHtml += "<li rel=" + i + "><a tabindex='-1' href='#'><label class='checkbox inline'>"+
                    "<input class='ignore' " + _inputAttr + checkedAttr + " />"+_li[i][0]+"</label></a></li>";
                }
            }

            template = template.replace('__ADD_LI', _liHtml);

            return template;
        },

        createSelectedStr: function($select){
            var textToShow,
                selectedLabels = [];
            $select = $select || this.$element;
            $select.find('option:selected').each(function(){
                 selectedLabels.push($(this).text());
             });
            
            if (selectedLabels.length === 0){
                return this.noneSelectedText;
            }
            textToShow = selectedLabels.join(', ');
            return (textToShow.length > this.lengthmax) ? selectedLabels.length + ' selected' : textToShow;
        },

        clickListener: function() {
            var _this = this;
           
            this.$newElement.find('li').on('click', function(e) {
                e.preventDefault();
               
                var rel = $(this).attr('rel'),
                    $input = $(this).find('input'),
                    $picker = $(this).parents('.bootstrap-select'),
                    $select = $picker.prev('select'),
                    $option = $select.find('option').eq(parseInt(rel,10)),
                    selectedBefore = $option.is(':selected');

                if (!_this.multiple){
                    $option.siblings('option').removeAttr('selected');
                    $picker.find('input').removeAttr('checked');
                }

                if (selectedBefore){
                    $input.prop('checked', false).removeAttr('checked');
                    $option.removeAttr('selected');
                }
                else{
                    $input.prop('checked', true);
                    $option.attr('selected', 'selected');
                }

                $picker.find('.filter-option').html(_this.createSelectedStr($select));

                $select.trigger('change');
            });
        },
        update : function(){
           this.$newElement.remove();
           this.init();
        }
    };

    $.fn.selectpicker = function(option, event) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('selectpicker'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('selectpicker', (data = new Selectpicker(this, options, event)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

    $.fn.selectpicker.Constructor = Selectpicker;

})(window.jQuery);



/**
 * Geopoint widget(s)
 */

(function($) {
    "use strict";

    var GeopointWidget = function(element, options) {
        this.$inputOrigin = $(element);
        this.$form = this.$inputOrigin.closest('form');
        console.debug('options for geopoint widget: ', options);
        this.init();

    };

    GeopointWidget.prototype = {

        constructor: GeopointWidget,

        init: function(){
            var mapOptions, map, marker, searchBox, geocoder,

                inputVals = this.$inputOrigin.val().split(' '),
            
                $widget = $(
                    '<div class="geopoint widget">'+
                    '<div class="search-bar">'+
                        '<button name="geodetect" type="button" class="btn" title="detect current location">'+
                        '<i class="icon-crosshairs"></i></button>'+
                    '<div class="input-append">'+
                        '<input class="geo ignore" name="search" type="text" placeholder="search for place or address" disabled="disabled"/>'+
                        '<button type="button" class="btn add-on"><i class="icon-search"></i>'+
                    '</div>'+
                    '</div>'+
                    '<div class="map-canvas-wrapper"><div class="map-canvas"></div></div>'+
                    '<div class="geo-inputs">'+
                        '<label class="geo">latitude (x.y &deg;)<input class="ignore" name="lat" type="number" step="0.0001" /></label>'+
                        '<label class="geo">longitude (x.y &deg;)<input class="ignore" name="long" type="number" step="0.0001" /></label>'+
                        '<label class="geo"><input class="ignore" name="alt" type="number" step="0.1" />altitude (m)</label>'+
                        '<label class="geo"><input class="ignore" name="acc" type="number" step="0.1" />accuracy (m)</label>'+
                    '</div>'+
                    '</div>'
                    ),
                $map = $widget.find('.map-canvas'),
                $lat = $widget.find('[name="lat"]'),
                $lng = $widget.find('[name="long"]'),
                $alt = $widget.find('[name="alt"]'),
                $acc = $widget.find('[name="acc"]'),
                $search = $widget.find('[name="search"]'),
                $button = $widget.find('button[name="geodetect"]');

            this.$inputOrigin.hide().after($widget),
            
            $widget.find('input:not([name="search"])').on('change change.bymap change.bysearch', function(event){
                //console.debug('change event detected');
                var lat = ($lat.val() !== '') ? $lat.val() : 0.0, 
                    lng = ($lng.val() !== '') ? $lng.val() : 0.0, 
                    alt = ($alt.val() !== '') ? $alt.val() : 0.0, 
                    acc = $acc.val();
                //event.preventDefault();
                this.$inputOrigin.val(lat+' '+lng+' '+alt+' '+acc).trigger('change');
                //console.log(event);
                if (typeof google !== 'undefined' && google.maps !== 'undefined' && event.namespace !== 'bymap' && event.namespace !== 'bysearch'){
                    updateMap(lat, lng);
                }
                if (event.namespace !== 'bysearch'){
                    $search.val('');
                }
                //event.stopPropagation();
                return false;
            });

            if (inputVals[3]) $acc.val(inputVals[3]);
            if (inputVals[2]) $alt.val(inputVals[2]);
            if (inputVals[1]) $lng.val(inputVals[1]);
            if (inputVals[0].length > 0) $lat.val(inputVals[0]).trigger('change');

            if (!navigator.geolocation){
                $button.attr('disabled', 'disabled');
            }
            
            $button.click(function(event){
                event.preventDefault();
                navigator.geolocation.getCurrentPosition(function(position){    
                    updateMap(position.coords.latitude, position.coords.longitude);
                    updateInputs(position.coords.latitude, position.coords.longitude, position.coords.altitude, position.coords.accuracy);  
                });
                return false;
            });

            //if ($(this).val() === ''){
            //  $button.click();
            //}

            this.$form.on('googlemapsscriptloaded', function(){
                if (typeof google !== 'undefined' && typeof google.maps !== 'undefined'){
                    //default map view
                    updateMap(0,0,1);
                    geocoder = new google.maps.Geocoder();
                    $search.removeAttr('disabled');
                }
            });

            $search.on('change', function(event){
                event.stopImmediatePropagation();
                //console.debug('search field click event');
                var address = $(this).val();
                if (typeof geocoder !== 'undefined'){
                    geocoder.geocode(
                        {
                            'address': address,
                            'bounds' : map.getBounds()
                        },
                        function(results, status) { 
                            if (status == google.maps.GeocoderStatus.OK) {
                                $search.attr('placeholder', 'search');
                                var loc = results[0].geometry.location;
                                console.log(loc);
                                updateMap(loc.lat(), loc.lng());
                                updateInputs(loc.lat(), loc.lng(), null, null, 'change.bysearch');
                            }
                            else {
                                $search.val('');
                                $search.attr('placeholder', address+' not found, try something else.');
                            }
                        }
                    );
                }
                return false;
            });

            /**
             * [updateMap description]
             * @param  {number} lat  [description]
             * @param  {number} lng  [description]
             * @param  {number=} zoom [description]
             */
            function updateMap(lat, lng, zoom){
                zoom = zoom || 15;
                if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.LatLng !== 'undefined'){
                    mapOptions = {
                        zoom: zoom,
                        center: new google.maps.LatLng(lat, lng),
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false
                    };
                    map = new google.maps.Map($map[0], mapOptions);
                    placeMarker();
                    // place marker where user clicks
                    google.maps.event.addListener(map, 'click', function(event){
                        updateInputs(event.latLng.lat(), event.latLng.lng(), '', '', 'change.bymap');
                        placeMarker(event.latLng);
                    });
                }
            }

            /**
             * [placeMarker description]
             * @param  {Object.<string, number>=} latLng [description]
             */
            function placeMarker(latLng){
                latLng = latLng || map.getCenter();
                if (typeof marker !== 'undefined'){
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position: latLng, //map.getCenter(),
                    map: map,
                    draggable: true
                });
                // dragging markers
                google.maps.event.addListener(marker, 'dragend', function() {
                    updateInputs(marker.getPosition().lat(), marker.getPosition().lng(), '', '', 'change.bymap');
                    centralizeWithDelay();
                });
                centralizeWithDelay();
                //center it (optional)
                //map.setCenter(latLng);
            }

            function centralizeWithDelay(){
                window.setTimeout(function() {
                    map.panTo(marker.getPosition());
                }, 5000);
            }
            /**
             * [updateInputs description]
             * @param  {number} lat [description]
             * @param  {number} lng [description]
             * @param  {?(string|number)} alt [description]
             * @param  {?(string|number)} acc [description]
             * @param  {string=} ev  [description]
             */
            function updateInputs(lat, lng, alt, acc, ev){
                alt = alt || '';
                acc = acc || '';
                ev = ev || 'change';
                $lat.val(Math.round(lat*10000)/10000);
                $lng.val(Math.round(lng*10000)/10000);
                $alt.val(Math.round(alt*10)/10);
                $acc.val(Math.round(acc*10)/10).trigger(ev);
            }
        }
    };

    $.fn.geopointWidget = function(option) {
        console.debug('geopoint inputs provided: ', this);
        //console.debug('typeof connection:'+ typeof connection);
       // console.debug('typeof google:'+ typeof google);
        if (typeof connection !== 'undefined' ){
            connection.loadGoogleMaps(function(){$('form.jr').trigger('googlemapsscriptloaded');});
        }

        return this.each(function() {
            var $this = $(this),
                data = $(this).data('geopointwidget'),
                options = typeof option == 'object' && option;
            if (!data){
                $this.data('geopointwidget', (data = new GeopointWidget(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

    $.fn.geopointWidget.Constructor = GeopointWidget;

})(window.jQuery);